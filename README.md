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

### 2. Language Toggle & Affordance

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load page | French content visible; `<html lang="fr" data-lang="fr">` |
| 2 | Check FR label in desktop toggle | FR is brand blue (#0B63CE), underlined, bold (font-weight: 700) |
| 3 | Check EN label | EN is neutral/muted color, no underline |
| 4 | Click EN radio | All content switches to English; EN now blue + underlined + bold; FR neutral |
| 5 | Reload page | English persists (localStorage) |
| 6 | Add `?lang=fr` to URL | French shown, overrides localStorage |
| 7 | Toggle back to FR | French content; FR is blue + underlined + bold |

**Screen reader test for language toggle**:
| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to FR radio (checked) | Announced with "(actuel)" in French mode or "(current)" in English mode |
| 2 | The non-active option | Does NOT announce "(actuel)"/"(current)" |

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

### 4. Mobile Menu (Phone Widths)

Test at 375px width in Chrome DevTools:

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load page at 375px width | Header shows logo + "Menu" button only; nav links not visible inline |
| 2 | Click Menu button | Menu panel opens below header with nav links and language toggle |
| 3 | Click a section link (e.g., Services) | Menu closes and page scrolls to section |
| 4 | Open menu, check language toggle | Active language is blue + underlined + bold (same affordance as desktop) |
| 5 | Open menu, toggle FR/EN | Content switches language; affordance updates correctly |
| 6 | Open menu, press Escape | Menu closes, focus returns to Menu button |
| 7 | Resize to 768px+ | Menu button disappears; desktop nav and language toggle visible |

**Keyboard test (mobile width)**:
| Step | Action | Expected |
|------|--------|----------|
| 1 | Tab to Menu button | Focus ring visible on Menu button |
| 2 | Press Enter or Space | Menu opens (aria-expanded="true") |
| 3 | Tab through menu | Focus moves through nav links, then language radios |
| 4 | Press Escape | Menu closes, focus returns to Menu button |

**Screen reader test (NVDA at mobile width)**:
| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to Menu button | Announced as "Menu, button, collapsed" |
| 2 | Activate button | Announced as "Menu, button, expanded"; menu content accessible |
| 3 | When menu closed | Menu panel content NOT read (hidden from accessibility tree) |
| 4 | Navigate language radios | Announced as "Langue" group with FR/EN options; active has "(actuel)" |

### 5. Desktop Responsiveness & Nav Stacking

**Critical test - resize from 320px to 1400px slowly**:

| Width Range | Expected |
|-------------|----------|
| 320px - 919px | Mobile menu button visible; nav links hidden; NO nav wrapping |
| 920px+ | Desktop nav visible inline; NO nav items stacking/wrapping |

Test at these specific widths:

| Width | Expected |
|-------|----------|
| 919px | Mobile menu still active; Menu button visible |
| 920px | Nav inline; Menu button hidden; no wrapping |
| 1100px+ | Full layout; 3-col cards |

**Check**:
- No horizontal scroll
- Text readable at all sizes
- Nav items NEVER wrap/stack at any width (either inline or hidden in menu)
- Language toggle always accessible (desktop: header; mobile: in menu)
- No layout breaking

### 6. Anchor Scroll (Mobile)

Test on phone or at 375px width:

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open mobile menu | Menu panel visible |
| 2 | Tap "Services" link | Page scrolls; "Services" heading visible below header (not hidden under it) |
| 3 | Tap "Méthode" link | Page scrolls; "Méthode" heading visible below header |
| 4 | Tap "Contact" link | Page scrolls; "Contact" heading visible below header |

**Critical check**: Section headings must NOT be hidden under the sticky header after tapping nav links.

### 7. Scroll Effects (Optional)

Test with `?effects=1` query parameter:

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load page with `?effects=1` | Page loads normally |
| 2 | Scroll through Services section | "Ce que je fais" / "What I do" heading stays sticky at top while scrolling within section |
| 3 | Scroll past section | Heading scrolls away as next section begins |
| 4 | Enable `prefers-reduced-motion: reduce` in browser | Sticky effect disabled; normal scroll behavior |
| 5 | Load page without `?effects=1` | No sticky heading effect |

### 8. Performance (Lighthouse)

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

### Header Offset

The `--header-offset` variable (default: `80px`) controls scroll positioning for anchor links. It ensures section headings are visible below the sticky header when navigating. Adjust if your header height changes:

```css
:root {
  --header-offset: 80px;
}
```

This variable is used by:
- `scroll-padding-top` on `<html>` for native anchor scrolling
- `scroll-margin-top` on `.section` elements
- Sticky section titles (when effects enabled)

### Responsive Breakpoint

The mobile/desktop nav breakpoint is **920px**. Below this width, the hamburger menu appears. This prevents nav items from wrapping at mid-widths.

### Scroll Effects (Experimental)

Enable sticky section titles that "linger" during scroll:

```
https://yoursite.com/?effects=1
```

This adds `data-effects="on"` to `<html>`, making section `<h2>` elements sticky within their section. Automatically disabled when `prefers-reduced-motion: reduce` is set.

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
