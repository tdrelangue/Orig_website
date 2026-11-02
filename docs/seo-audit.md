# Technical SEO & AI-search audit — www.origai.fr

Date: 2 November 2026 · Branch: `feat/technical-seo` · Scope: the whole repository plus live checks on `https://www.origai.fr`.

## 0. Premise correction

The brief describes a Next.js 15 site. **The repository is not Next.js**: it is a hand-written static site (9 HTML pages, one `styles.css`, one `script.js`, no build step, `package.json` is `{}`), deployed on Netlify (`_redirects`). Every finding below is about that real implementation. Consequences:

- Every page is fully server-delivered HTML: no rendering problem for any crawler.
- There are no lint, type-check or build commands to run (see §4).
- Next.js-specific fixes (Metadata API, `app/sitemap.ts`…) do not apply.

## 1. Method

- Read every page `<head>`, headings, links, images, `script.js` (language toggle), `robots.txt`, `sitemap.xml`, `_redirects`, project memory (design, EcoIndex budget, UX rules).
- Live HTTP checks with `curl` on the production domain (status codes, redirects, headers).
- Validation script (metadata, JSON-LD, canonical ⇄ sitemap ⇄ robots, internal links, headings, images), itself tested by injecting four faults into a copy (all four caught).
- EcoIndex estimate with the ecoindex.fr quantiles, before and after, because the footer displays a score that must stay true.

## 2. Findings

Legend: **Verified** = observed in code or on the live site. **Potential** = improvement whose effect cannot be measured from here.

### Critical

| # | Finding | Evidence | Impact | Fix | Status |
|---|---|---|---|---|---|
| C1 | **No legal notice (mentions légales)** | No page or footer block names the publisher, its legal status, SIREN or address; the privacy page lists the data controller only as "OrigAI" + an e-mail. | Legal requirement for a French professional site (LCEN art. 6-III). Also the main trust and identity signal for search engines and AI systems: right now nothing says who OrigAI is legally. | Add a "Mentions légales" page (publisher name, status, SIREN, address, publication director, host: Netlify). | **Not implemented — needs facts only Thomas can provide.** See the external checklist. |

No technical issue blocks crawling or indexing.

### Important

| # | Finding | Evidence | Impact | Fix | Status |
|---|---|---|---|---|---|
| I1 | No Open Graph or Twitter card tags | None of the 9 pages had any `og:*` or `twitter:*` tag. | Link previews (LinkedIn, Slack, messaging apps, some AI tools) showed a bare link or a guessed image. On home the preview title was just "OrigAI". | Added `og:type`, `og:title`, `og:url` (= canonical), `og:image` (logo, 631×631) + `og:image:alt`, `twitter:card=summary`. `og:description` left out on purpose: platforms fall back to the meta description, and every extra tag adds a DOM node to the EcoIndex. | **Done** |
| I2 | Structured data not linked together, services not described | Organization and WebSite were two separate scripts; product `publisher` blocks repeated the organization without an `@id`; the 3 service pages had no structured data. | Search engines and AI systems had no machine-readable link between the organization, its services and its products. | Home: one `@graph` with `Organization` (`@id …/#organization`, `knowsAbout` = the services actually offered on the site) and `WebSite` (`publisher` → that `@id`). Service pages: `Service` (name = H1, description = meta description, `provider` → organization). Products: `publisher` gets the same `@id`. | **Done** |
| I3 | Sitemap `lastmod` inaccurate | Every URL said `2026-10-05`; git shows later changes (home and OrigPDF 16 Oct, Tutellia 11 Oct, Products 2 Nov). | Bing in particular uses `lastmod` to schedule recrawls; a wrong date undermines it. | Set each `lastmod` to the date of the last *content* change in git. Removed `changefreq`/`priority` (ignored by Google, extra upkeep). | **Done** |
| I4 | Default Netlify 404 page | `/nope-404` returns a correct `404` status but Netlify's generic English page, with no navigation. | Status is right, so no indexing harm; but a visitor following a broken link leaves the site. | Added `404.html`: bilingual, `noindex`, site header/footer, links to home, products and contact. All URLs absolute because Netlify serves it at any depth. Rendered and checked in a browser. | **Done** |
| I5 | Home `<title>` is only "OrigAI" | Short tab titles are a **deliberate decision** (project memory, UX rule 3: tab titles stay short for WCAG 2.4.2; long wording goes in the meta description). | The `<title>` is the main title shown in search results; "OrigAI" says nothing about the services to someone who doesn't know the name. | Thomas approved (2 Nov 2026) a short descriptive title: "OrigAI – logiciels sur mesure et IA" (EN: "OrigAI – custom software and AI"). The fuller phrase stays in `og:title`. | **Done** |
| I6 | English content cannot be indexed | One URL per page; English is swapped in by `script.js` (`data-en`, `?lang=en`). Canonical always points to the French URL. | Google and Bing index the French version only. English-speaking searches will not find the English text. No duplicate-content risk. | Proper fix = separate English URLs (e.g. `/en/…`) with `hreflang` pairs. That doubles the pages to maintain and is a product decision. **Do not** add `hreflang` to `?lang=en`: Bing doesn't run the toggle script and would see French content under an "English" URL. | **Decision for Thomas** |

### Optional

| # | Finding | Evidence | Fix | Status |
|---|---|---|---|---|
| O1 | Internal links to `index.html` while canonical is `/` | 43 `href="index.html"` links; `/index.html` returns 200. | Changed to `href="/"` so links match the canonical. Local preview through a server (`python -m http.server`, as in the README) still works; opening files with `file://` does not follow `/`. | **Done** |
| O2 | Maintainer READMEs are public | `/README.md`, `/assets/README.md`, `/releases/README.md` return 200 (repo root = publish folder). | `_headers` adds `X-Robots-Tag: noindex` to the three files. Nothing sensitive in them; this only keeps them out of results. | **Done** |
| O3 | Outdated `robots.txt` comment ("accessibility consulting site") | — | Comment updated; rules unchanged. | **Done** |
| O4 | `.html` / extensionless duplicates | `/logiciel` and `/logiciel.html` both return 200 (Netlify Pretty URLs). | Already handled by self-referencing canonicals. Nothing to do. | Compliant |
| O5 | Square logo as social image | `og:image` is the 631×631 logo, shown as a small thumbnail. | A 1200×630 card would make larger previews. Needs a design asset, so it's a choice for Thomas. | Proposed |
| O6 | Per-OS versions in `SoftwareApplication` | `softwareVersion` gives the Windows version (Tutellia 2.0.8, OrigPDF 1.0.1); macOS builds are older (2.0.7, 0.1.0). | Acceptable: schema.org has a single version field. Update it with every release (already on the release checklist). | Note |
| O7 | No product rich results | Google's software rich result needs a rating or reviews. | **Do not add ratings or reviews unless real users wrote them.** Current markup is valid but won't show stars. | Note |
| O8 | Asset caching | CSS/JS are served with `max-age=0, must-revalidate` (Netlify default). | Revalidation returns 304s; long caching would need fingerprinted file names. Not worth a build step at this size. | Note |
| O9 | `sameAs` on Organization | No official profiles are linked on the site. | Add `sameAs` only for official profiles Thomas actually maintains (LinkedIn, GitHub organization…). | Proposed |

### Already compliant (verified)

- **Redirects**: `http://origai.fr`, `https://origai.fr`, `http://www.` all 301 to `https://www.origai.fr/`; the old `orig-audit.netlify.app` 301s to the new domain (except `/releases/*`, kept on 200 for older app versions, see `_redirects`). HSTS is on.
- **Canonicals**: present, absolute and self-referencing on every page.
- **robots.txt**: everything is open except `/releases/` (app update channels). Search and AI-search crawlers (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot…) are all allowed under `User-agent: *`. Nothing is blocked by mistake.
- **Sitemap**: lists all 9 public pages, nothing blocked by robots, every URL has a file.
- **Crawlability**: all content is in the HTML returned by the server; the only JS is the language toggle, menu and form checks.
- **Headings**: one H1 per page, no skipped levels (hidden English H2/H3 mirror the French ones and use `hidden`).
- **Meta descriptions**: present and unique on every page (96–200 characters).
- **Images**: all have `alt` (empty for decoration, descriptive for screenshots) and `width`/`height`; screenshots below the fold use `loading="lazy"`, the hero image uses `fetchpriority="high"`.
- **Mobile & performance**: viewport meta, system fonts (0 web fonts), 4–9 requests per page, official EcoIndex A 84/100 on home. No field Core Web Vitals data is available (traffic is too low for CrUX); there is nothing in the code that suggests a layout-shift or slow-loading risk.
- **Accessibility**: `lang="fr"` switched to `en` by the toggle, skip link, labelled landmarks, `aria-current` — consistent with the WCAG 2.2 AA target.
- **Product structured data** (`SoftwareApplication` + `Offer`) is valid and matches the pages (OrigPDF free, Tutellia 30 €/year).
- **Search console verification**: both the HTML file and the meta tag are in place (left as they are).

## 3. GEO (AI-assisted search)

- **Access**: public pages are open to AI search crawlers (see above). Whether to also allow *training* crawlers (GPTBot, Google-Extended, CCBot…) is a business choice, not a technical fix. Both are currently allowed. See the checklist.
- **Accurate representation**: organization, services and products are now described in structured data using only wording already on the pages. Nothing was added that the site doesn't already state.
- **Main gap**: identity. AI answers about "who is behind OrigAI" can only quote "OrigAI" and an e-mail address. The mentions légales (C1) and, if Thomas wants, a short "about" sentence naming the founder would fix this with facts, not tricks.
- Not done on purpose: no `llms.txt` (no major engine has committed to reading it), no keyword lists, no fabricated reviews or ratings, no unverifiable claims.

## 4. Validation

| Check | Result |
|---|---|
| Lint / type-check / build | **None exist** (static site, no build tooling). `node --check script.js` passes; `script.js` was not changed. |
| Metadata (10 pages) | Exactly one canonical, `og:url`, `og:title` and description per page; `og:url` = canonical; canonical = expected URL; titles and descriptions unique. |
| JSON-LD | Every block parses; `@context` correct; `Service.url` / `SoftwareApplication.url` = canonical; `provider` / `publisher` → `#organization`; logo file exists. |
| Sitemap ⇄ robots | 9 URLs, all exist, none disallowed, every canonical is listed, `lastmod` dates well formed. |
| Internal links | No broken internal link (including the new 404 page). |
| 404 page | `noindex`, no canonical, absolute URLs only; renders correctly in Chrome. |
| Validator self-test | 4 injected faults (wrong `og:url`, missing `provider @id`, broken link, URL missing from sitemap) → all 4 reported. |
| EcoIndex (estimate, ecoindex.fr formula) | Home 84.5 → 84.3, Tutellia (lowest) 82.2 → 81.95, every page still **A**. The footer's "84/100" still holds; re-check on ecoindex.fr after deploy. |

Not checked from here, to do after deploy: Google Rich Results Test and Schema.org validator on the live URLs, `X-Robots-Tag` on the READMEs, 404 served by Netlify (see checklist).

## 5. Files changed

| File | Change |
|---|---|
| all 9 pages | OG/Twitter tags; `index.html` links → `/` |
| `index.html` | Short descriptive `<title>`; Organization + WebSite merged into one linked `@graph`, `knowsAbout` added |
| `logiciel.html`, `ia-data.html`, `ergonomie.html` | `Service` JSON-LD |
| `tutellia.html`, `origpdf.html` | `publisher` linked to `#organization` |
| `404.html` | new |
| `_headers` | new — `noindex` on the 3 READMEs |
| `robots.txt` | comment only |
| `sitemap.xml` | real `lastmod` dates, `changefreq`/`priority` removed |

No dependency, tracker or analytics added. Design, bilingual toggle and accessibility behaviour unchanged.

**Upkeep:** when a page's content changes, update its `<lastmod>` in `sitemap.xml`. When a page is added, give it a canonical, the 6 OG/Twitter tags and a sitemap entry, and use absolute links if it can be served at any depth.

## 6. Ranking claims

None of these changes is claimed to improve rankings. What they do, verifiably: give accurate previews and machine-readable descriptions, correct recrawl dates, and a working dead-end page. Measure any effect in Search Console and Bing Webmaster Tools over the following weeks.
