# SEO — actions outside the codebase

Companion to `docs/seo-audit.md`. These need an account, a deploy or a decision from Thomas.

## After deploying `feat/technical-seo`

- [ ] `curl -I https://www.origai.fr/README.md` shows `X-Robots-Tag: noindex`
- [ ] `https://www.origai.fr/anything-wrong` shows the new OrigAI 404 page **with status 404**
- [ ] Re-measure home and `tutellia.html` on ecoindex.fr; update the footer badge if the official score changes
- [ ] Test `https://www.origai.fr/` and `/tutellia.html` in the Google Rich Results Test and validator.schema.org
- [ ] Test a link preview in the LinkedIn Post Inspector (it also refreshes LinkedIn's cache)

## Google Search Console

- [ ] Check which property is verified (the HTML file and the meta tag carry two different tokens — maybe two properties or two owners). Keep both until you know.
- [ ] Prefer a **Domain property** (`origai.fr`, DNS TXT verification): it covers http/https, www/apex and subdomains.
- [ ] Sitemaps → submit or resubmit `https://www.origai.fr/sitemap.xml`
- [ ] Pages report: confirm the 9 pages are "Indexed" and the `.html`/extensionless variants appear under "Alternate page with proper canonical tag" (expected)
- [ ] URL inspection → "Request indexing" for home, `tutellia.html`, `origpdf.html`
- [ ] If the old `orig-audit.netlify.app` property exists: use Change of Address to `www.origai.fr`

## Bing Webmaster Tools (also used by ChatGPT Search, Copilot, DuckDuckGo)

- [ ] Add the site; the fastest way is "Import from Google Search Console"
- [ ] Submit `https://www.origai.fr/sitemap.xml`
- [ ] Optional: turn on IndexNow (Netlify has no built-in support; a manual ping after each deploy is enough at this size)

## Decisions for Thomas

- [ ] **Mentions légales** (legal requirement, LCEN art. 6-III): publisher name, legal status, SIREN, address (a business address is fine), publication director, host (Netlify, Inc. — copy the current address from Netlify's legal page). Once provided, add the page, link it in the footer and add it to the sitemap.
- [x] **Home title**: changed to "OrigAI – logiciels sur mesure et IA" (approved 2 Nov 2026)
- [ ] **English indexing**: stay French-only for search (current) or create `/en/` pages with `hreflang`?
- [ ] **AI training crawlers**: allowing AI *search* crawlers is fine either way. To opt out of *training* only, add `User-agent: GPTBot`, `Google-Extended`, `CCBot`, `anthropic-ai`… with `Disallow: /` to `robots.txt`.
- [ ] **`sameAs`**: list the official profiles (LinkedIn, GitHub…) to link from the Organization schema, if any.
- [ ] **Social card**: make a 1200×630 image for larger link previews (optional).

## Off-site (identity, not ranking tricks)

- [ ] Google Business Profile only if OrigAI serves clients at an address or in a defined area
- [ ] Make sure the company directory listing (annuaire-entreprises.data.gouv.fr / INSEE) shows the same name as the site
