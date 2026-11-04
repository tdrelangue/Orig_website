// French source page -> English page path. The French pages are the source of
// truth: they carry their English text in data-en / data-*-en attributes and
// data-lang="en" blocks; scripts/build-en.mjs writes the /en/ pages from them.
export const SITE = 'https://www.origai.fr';

export const PAGES = {
  'index.html': '/en/',
  'logiciel.html': '/en/software.html',
  'ia-data.html': '/en/ai-data.html',
  'ergonomie.html': '/en/ergonomics.html',
  'produits.html': '/en/products.html',
  'contact.html': '/en/contact.html',
  'confidentialite.html': '/en/privacy.html',
  'origpdf.html': '/en/origpdf.html',
  'tutellia.html': '/en/tutellia.html',
  '404.html': '/en/404.html',
};

/** Public French path of a source file ("index.html" -> "/"). */
export function frPath(file) {
  return file === 'index.html' ? '/' : `/${file}`;
}

/** English output file on disk ("/en/" -> "en/index.html"). */
export function enFile(file) {
  const path = PAGES[file];
  return path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1);
}
