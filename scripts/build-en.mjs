// Writes the English pages (/en/) from the French pages.
//   node scripts/build-en.mjs           write en/*.html
//   node scripts/build-en.mjs --check   exit 1 if en/ is out of date or text is untranslated
// The French page is the source: English text lives in data-en (text-only
// elements), data-lang="en" blocks (text with markup), data-label-en (aria-label),
// data-alt-en, data-content-en (meta), data-href-en, data-title-en (<html>), and
// scripts/en-jsonld.json (structured data strings).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SITE, enFile } from './pages.mjs';
import { findUntranslated } from './en-check.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JSONLD_EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/en-jsonld.json'), 'utf8'));
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const ATTR_SWAPS = [['data-label-en', 'aria-label'], ['data-alt-en', 'alt'], ['data-content-en', 'content'], ['data-href-en', 'href']];
const DROPPED = ['data-en', 'data-fr', 'data-label-fr', 'data-lang'];

/** Index just past the element that starts at `start` (well-formed HTML assumed). */
function elementEnd(html, start) {
  const tag = /^<([a-zA-Z][\w-]*)[^>]*>/.exec(html.slice(start));
  if (!tag) throw new Error(`no start tag at ${start}`);
  const name = tag[1].toLowerCase();
  const afterTag = start + tag[0].length;
  if (VOID.has(name)) return afterTag;
  const re = new RegExp(`<(/?)${name}\\b[^>]*>`, 'gi');
  re.lastIndex = afterTag;
  let depth = 1;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return re.lastIndex;
  }
  throw new Error(`unclosed <${name}> at ${start}`);
}

/** Replace every element whose start tag matches `re` with fn(element). */
function mapElements(html, re, fn) {
  let out = html;
  const global = new RegExp(re.source, 'g');
  for (let m = global.exec(out); m; m = global.exec(out)) {
    const end = elementEnd(out, m.index);
    const replacement = fn(out.slice(m.index, end), m[0]);
    out = out.slice(0, m.index) + replacement + out.slice(end);
    global.lastIndex = m.index + replacement.length;
  }
  return out;
}

function getAttr(tag, name) {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? m[1] : null;
}

function setAttr(tag, name, value) {
  if (getAttr(tag, name) !== null) return tag.replace(new RegExp(`(\\s${name}=)"[^"]*"`), `$1"${value}"`);
  return tag.replace(/\s*\/?>$/, (end) => ` ${name}="${value}"${end}`);
}

function removeAttr(tag, name) {
  return tag.replace(new RegExp(`\\s${name}(="[^"]*")?(?=[\\s/>])`), '');
}

/** Drop data-lang="fr" elements, including the line they sat on. */
function removeFrench(html) {
  return mapElements(html, /<(?!html\b)[a-zA-Z][^>]*\sdata-lang="fr"[^>]*>/, () => '\u0000')
    .replace(/\n[ \t]*\u0000[ \t]*(?=\n)/g, '')
    .replace(/\u0000/g, '');
}

/** <tag data-en="EN">FR</tag> -> <tag>EN</tag> */
function swapText(html) {
  return mapElements(html, /<(?!html\b)[a-zA-Z][^>]*\sdata-en="[^"]*"[^>]*>/, (el, start) => {
    const close = el.lastIndexOf('</');
    if (el.slice(start.length, close).includes('<')) throw new Error(`data-en on element with markup: ${start}`);
    return `${start}${getAttr(start, 'data-en')}${el.slice(close)}`;
  });
}

/** English path of a site URL, or the URL unchanged when it is not a page. */
function mapUrl(url) {
  if (/^(mailto:|#|data:)/.test(url) || (/^https?:/.test(url) && !url.startsWith(SITE))) return url;
  const absolute = url.startsWith(SITE);
  const rest = absolute ? url.slice(SITE.length) || '/' : url;
  const [, pathPart, suffix] = /^([^?#]*)(.*)$/.exec(rest);
  const rooted = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  const file = rooted === '/' ? 'index.html' : rooted.slice(1);
  const mapped = (PAGES[file] ?? rooted) + suffix;
  return absolute ? SITE + mapped : mapped;
}

function isUrl(value) {
  return value.startsWith('/') || value.startsWith(SITE) || /^[\w./-]+\.(html|css|js|svg|png|webp|ico)([?#].*)?$/.test(value);
}

/** Lang switch: the English link becomes the current one. */
function markCurrentLanguage(tag) {
  if (!/\sclass="lang-label"/.test(tag)) return tag;
  return getAttr(tag, 'hreflang') === 'en' ? setAttr(tag, 'aria-current', 'true') : removeAttr(tag, 'aria-current');
}

function translateTag(tag) {
  let out = getAttr(tag, 'data-lang') === 'en' ? removeAttr(tag, 'hidden') : tag;
  for (const [from, to] of ATTR_SWAPS) {
    const value = getAttr(out, from);
    if (value !== null) out = removeAttr(setAttr(out, to, value), from);
  }
  for (const name of DROPPED) out = removeAttr(out, name);
  if (getAttr(out, 'hreflang') !== null) return markCurrentLanguage(out);
  for (const name of ['href', 'src', 'content']) {
    const value = getAttr(out, name);
    if (value !== null && isUrl(value)) out = setAttr(out, name, mapUrl(value));
  }
  return out;
}

/** Translate structured-data strings and point page URLs at the English pages. */
function translateJsonLd(value, missing) {
  if (Array.isArray(value)) return value.map((v) => translateJsonLd(v, missing));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translateJsonLd(v, missing)]));
  }
  if (typeof value !== 'string') return value;
  if (value.startsWith(SITE)) return /\.html$/.test(value) ? mapUrl(value) : value;
  if (JSONLD_EN[value] !== undefined) return JSONLD_EN[value];
  if (/[a-zà-ÿ]{3,}\s/i.test(value) && /[éèàùçêôî]|\b(et|de|des|pour|sur|vos|votre)\b/i.test(value)) missing.push(value);
  return value;
}

function convertJsonLd(html, missing) {
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
    (_, open, json, close) => open + JSON.stringify(translateJsonLd(JSON.parse(json), missing)) + close);
}

/** <html lang="fr" data-title-en="..."> -> <html lang="en">, and the <title>. */
function convertRoot(html, file) {
  const root = /<html\b[^>]*>/.exec(html);
  const title = root && getAttr(root[0], 'data-title-en');
  if (!title) throw new Error(`${file}: <html> has no data-title-en`);
  const banner = `\n<!-- Generated from ${file} by scripts/build-en.mjs: edit the French page, then rerun the script. -->`;
  return html
    .replace(root[0], `<html lang="en">${banner}`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
}

export function buildPage(file, html) {
  const missing = [];
  let out = convertRoot(html, file);
  out = removeFrench(out);
  out = swapText(out);
  out = convertJsonLd(out, missing);
  out = out.replace(/<[a-zA-Z][^>]*>/g, (tag) => (tag.startsWith('<html') ? tag : translateTag(tag)));
  return { html: out, missing: missing.map((s) => `structured data: "${s}"`) };
}

function run(check) {
  let failed = false;
  for (const file of Object.keys(PAGES)) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const { html: built, missing } = buildPage(file, source);
    const html = built.replace(/\r\n/g, '\n');
    const frenchVisible = mapElements(source, /<(?!html\b)[a-zA-Z][^>]*\sdata-lang="en"[^>]*>/, () => '');
    const problems = [...missing, ...findUntranslated(frenchVisible, html)];
    for (const p of problems) process.stderr.write(`${file}: untranslated ${p}\n`);
    const target = path.join(ROOT, enFile(file));
    // Line endings follow git's autocrlf setting, so they never count as drift.
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') : null;
    if (check && current !== html) process.stderr.write(`${enFile(file)}: out of date, run node scripts/build-en.mjs\n`);
    if (!check && current !== html) fs.mkdirSync(path.dirname(target), { recursive: true });
    if (!check && current !== html) fs.writeFileSync(target, html);
    failed ||= problems.length > 0 || (check && current !== html);
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.exitCode = run(process.argv.includes('--check'));
}
