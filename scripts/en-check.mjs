// Flags text that the English page shows exactly as the French page does,
// i.e. French text nobody gave an English version. Words that are the same in
// both languages go in SAME_IN_BOTH.
const SAME_IN_BOTH = new Set([
  'OrigAI', 'Orig', 'AI', 'OrigPDF', 'Tutellia', 'FR', 'EN', 'Menu', 'Contact', 'Netlify', 'EcoIndex', 'A',
  'Windows', 'macOS', 'Version', 'Python', 'Email', 'Message', 'Cookies', 'Services', 'PDF', 'Exploration',
  'exe', 'dmg', 'v', 'xattr', 'dr', 'com', 'apple', 'quarantine', 'Applications', 'app',
  'français', 'English', 'Do', 'not', 'fill',
]);

/** True when every word is the same in French and English (names, versions, hashes, commands). */
function isNeutral(text) {
  if (/^[\w.+-]+@[\w.-]+$/.test(text) || /^[0-9a-f]{32,}$/.test(text)) return true;
  return text.split(/[^A-Za-zÀ-ÿ]+/).filter(Boolean).every((w) => SAME_IN_BOTH.has(w));
}

const TRANSLATED_ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];

function bodyOf(html) {
  const start = html.indexOf('<body');
  return html.slice(start === -1 ? 0 : start)
    .replace(/<script\b[\s\S]*?<\/script>/g, '')
    .replace(/<style\b[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

function textsOf(html) {
  return bodyOf(html)
    .split(/<[^>]*>/)
    .map((t) => t.replace(/\s+/g, ' ').trim())
    .filter((t) => /[a-zà-ÿ]{2,}/i.test(t));
}

function attrsOf(html) {
  const names = TRANSLATED_ATTRS.join('|');
  const values = [...html.matchAll(new RegExp(`\\s(?:${names})="([^"]+)"`, 'g'))].map((m) => m[1]);
  const metas = [...html.matchAll(/<meta (?:name="description"|property="og:(?:title|image:alt)") content="([^"]+)"/g)];
  return [...values, ...metas.map((m) => m[1])].filter((t) => /[a-zà-ÿ]{2,}/i.test(t));
}

/** Strings visible on the English page that are identical on the French one. */
export function findUntranslated(frenchVisible, english) {
  const frTexts = new Set(textsOf(frenchVisible));
  const frAttrs = new Set(attrsOf(frenchVisible));
  const texts = textsOf(english).filter((t) => frTexts.has(t) && !isNeutral(t)).map((t) => `text: "${t}"`);
  const attrs = attrsOf(english).filter((t) => frAttrs.has(t) && !isNeutral(t)).map((t) => `attribute: "${t}"`);
  return [...new Set([...texts, ...attrs])];
}
