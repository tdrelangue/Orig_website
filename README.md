# Orig - Bilingual Accessible One-Page Site

A minimal, eco-responsible bilingual (French/English) landing page for an independent accessibility and digital sobriety consultant.

## Features

- **Bilingual**: French (default) ↔ English toggle
- **WCAG 2.2 AA compliant**: Semantic HTML, keyboard navigation, screen reader tested
- **Eco-responsible**: No frameworks, no trackers, system fonts only
- **Lightweight**: ~3KB JavaScript, ~5KB CSS
- **Static**: Deploys anywhere with no build step

## Quick Start

### Local Development

```bash
# Clone the repo
git clone <repository-url>
cd Orig_website

# Run a local server (choose one)
python3 -m http.server 8000
# or
npx http-server -p 8000
# or
php -S localhost:8000

# Open http://localhost:8000
```

### Deploy to Netlify

**Option A: Drag-and-drop**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the project folder
3. Done

**Option B: Git deploy**
1. Push repo to GitHub/GitLab
2. Connect to Netlify
3. Build command: (empty)
4. Publish directory: `.` or `/`

## Language Toggle

### How It Works

Content uses `data-lang` attributes:

```html
<h1>
  <span data-lang="fr">Texte français</span>
  <span data-lang="en" hidden>English text</span>
</h1>
```

JavaScript toggles the `hidden` attribute and updates `<html lang="...">`.

### Persistence

1. URL parameter: `?lang=en` or `?lang=fr` (highest priority)
2. localStorage: `orig_lang` key
3. Default: French

### No-JS Fallback

With JavaScript disabled, French content displays (no `hidden` on FR spans by default).

## File Structure

```
/
├── index.html    # Main page (bilingual content)
├── styles.css    # Minimal styles (~5KB)
├── script.js     # Language toggle + form validation (~3KB)
├── assets/
│   └── logo-removebg-preview.png
├── robots.txt
├── sitemap.xml
└── README.md
```

## Contact Information

- **Email**: tdrelangue@gmail.com
- **Address**: 47 chemin du Peyroux, 19360 Malemort

## Manual Test Plan

### 1. Keyboard Navigation

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load page, press Tab | Skip link appears and is focused |
| 2 | Press Enter on skip link | Focus moves to `<main>` |
| 3 | Tab through header | Logo → Nav links → Language toggle (FR/EN radios) |
| 4 | Arrow keys on language toggle | Switch between FR and EN radios |
| 5 | Tab through all sections | All links and form fields reachable |
| 6 | Tab to form, press Enter on submit | Form validates; errors shown if empty |

**Check at each step**: Focus ring is visible on every focused element.

### 2. Language Toggle

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load page | French content visible; `<html lang="fr">` |
| 2 | Click EN radio | All content switches to English; `<html lang="en">` |
| 3 | Reload page | English persists (localStorage) |
| 4 | Add `?lang=fr` to URL | French shown, overrides localStorage |
| 5 | Toggle back to FR | French content; nav says "Services / Méthode / Pour qui / Contact" |

### 3. Screen Reader (NVDA)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load page in FR | NVDA announces French content |
| 2 | Press H to navigate headings | h1 → h2 (Services) → h2 (Méthode) → etc. |
| 3 | Press D to navigate landmarks | header, navigation, main, footer |
| 4 | Navigate to language toggle | Announced as "Langue du site" group with FR/EN options |
| 5 | Select EN | Content switches; NVDA now announces English |
| 6 | Navigate headings again | Only English headings read; no French duplicates |
| 7 | Submit empty form | Error messages announced via `role="alert"` |

**Critical check**: Inactive language content (hidden attribute) must NOT be read.

### 4. Responsiveness

Test at these widths:

| Width | Expected |
|-------|----------|
| 320px | Nav stacks below brand+toggle; 1-col cards |
| 640px | Nav inline; 2-col cards |
| 900px+ | Full layout; 3-col cards |

**Check**:
- No horizontal scroll
- Text readable at all sizes
- Language toggle always accessible
- No layout breaking

### 5. Performance (Lighthouse)

Run in Chrome DevTools (F12 → Lighthouse → Mobile):

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |
| CLS | ≤ 0.1 |

## Accessibility Checklist

### Structure
- [x] Single `<h1>`; headings in order (h1 → h2 → h3)
- [x] Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- [x] Skip link first focusable element
- [x] Logical tab order

### Keyboard
- [x] All interactive elements focusable
- [x] Visible focus ring on all elements
- [x] No keyboard traps
- [x] Language toggle operable via keyboard

### Screen Reader
- [x] `<html lang>` updates correctly
- [x] Inactive content uses `hidden` attribute
- [x] Form labels properly associated
- [x] Form errors announced (`role="alert"`)
- [x] No redundant ARIA

### Visual
- [x] Color contrast ≥ 4.5:1 (text) / 3:1 (large text)
- [x] Focus indicators visible
- [x] No information conveyed by color alone

### Motion
- [x] `prefers-reduced-motion` respected
- [x] No animations by default

## Performance Checklist

- [x] No external dependencies
- [x] No external fonts (system fonts only)
- [x] No trackers or analytics
- [x] Minimal JS (~3KB)
- [x] No expensive CSS (blur, heavy shadows)
- [x] Images have width/height (no CLS)

## Customization

### Brand Color

Edit `--brand` in `styles.css`:

```css
:root {
  --brand: #0B63CE;
}
```

### Contact Info

Update in `index.html`:
- Email: search for `tdrelangue@gmail.com`
- Address: search for `47 chemin du Peyroux`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE support

## License

No external dependencies. System fonts only.
