# Orig - Accessible Reference Site

A minimal, eco-responsible single-page landing site for an independent accessibility and digital sobriety consultant.

## Overview

This site demonstrates WCAG 2.2 AA compliance, semantic HTML, keyboard accessibility, and eco-design principles. Built with zero dependencies and designed for blind users, keyboard navigation, and screen reader compatibility.

## Tech Stack

- **HTML5** - Semantic markup with proper landmarks
- **CSS3** - Minimal, custom styles using system fonts
- **Vanilla JavaScript** - ~2KB for form validation only
- **No frameworks, no external dependencies, no trackers**

## File Structure

```
/
├── index.html              # Main single-page site
├── styles.css              # Minimal accessible styles
├── script.js               # Lightweight form validation
├── assets/
│   ├── logo.png            # Logo (light background)
│   └── logo-removebg-preview.png  # Logo (transparent)
├── robots.txt              # Search engine directives
├── sitemap.xml             # Single-page sitemap
└── README.md               # This file
```

## Setup Instructions

### Logo Files

**IMPORTANT**: Before deployment, add your logo files to the `assets/` folder:

1. Save the provided logo images as:
   - `assets/logo.png`
   - `assets/logo-removebg-preview.png`

2. The site currently references `logo-removebg-preview.png` in the header
3. Adjust `index.html` line 21 if you prefer the other logo variant

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Orig_website
   ```

2. **Run a local server**

   Using Python 3:
   ```bash
   python3 -m http.server 8000
   ```

   Using Node.js (with `http-server`):
   ```bash
   npx http-server -p 8000
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment to Netlify

#### Option 1: Drag-and-Drop Deploy

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire project folder into the browser
3. Site will be deployed instantly with a random URL
4. Configure custom domain in Netlify settings if desired

#### Option 2: Git-Based Deploy

1. Push this repository to GitHub, GitLab, or Bitbucket
2. Log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `/` or `.`
6. Deploy site

#### Netlify Forms Configuration

The contact form is configured for Netlify Forms:

- The form includes `data-netlify="true"` attribute
- A honeypot field is included for spam prevention
- After deployment, form submissions will appear in Netlify dashboard
- Set up email notifications in Netlify: Settings → Forms → Form notifications

#### Custom Domain Setup

1. In Netlify dashboard, go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## Accessibility Checklist

This site meets WCAG 2.2 AA standards. Verify compliance using the checklist below.

### Semantic Structure

- [x] One `<h1>` only; headings in correct hierarchical order (h1 → h2 → h3)
- [x] Proper landmark regions: `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`
- [x] Skip link visible on focus and functional
- [x] All interactive elements are keyboard accessible
- [x] Logical tab order throughout the page

### Keyboard Navigation

- [x] Focus is visible on all interactive elements
- [x] No keyboard traps
- [x] Skip link appears first when pressing Tab
- [x] All navigation links reachable and operable by keyboard
- [x] Form fields and submit button accessible via keyboard
- [x] Smooth scroll respects `prefers-reduced-motion`

### Screen Reader Support

- [x] Landmarks present and meaningful
- [x] Links have descriptive text (no "click here")
- [x] Images have appropriate `alt` text
- [x] Form labels properly associated with inputs
- [x] Form errors are announced via `role="alert"`
- [x] ARIA used minimally and correctly

### Color & Contrast

- [x] Color contrast meets WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- [x] Information not conveyed by color alone
- [x] Focus indicators have sufficient contrast
- [x] Brand blue (#0B63CE) provides adequate contrast on white/light backgrounds

### Forms

- [x] Real `<label>` elements with `for` attributes
- [x] Labels have meaningful text
- [x] Error messages are clear and descriptive
- [x] Error messages announced to screen readers
- [x] `autocomplete` attributes used appropriately
- [x] Honeypot field hidden from users

### Motion & Animation

- [x] No animations or parallax effects by default
- [x] `prefers-reduced-motion` media query implemented
- [x] Smooth scroll disabled when reduced motion preferred

## Performance Checklist

This site is designed for minimal environmental impact and maximum performance.

### Resource Optimization

- [x] No external libraries or frameworks
- [x] No external font files (system fonts only)
- [x] Only logo images included (2 files)
- [x] CSS is compact and minimal (~4-5 KB)
- [x] JavaScript is tiny (~2 KB) and optional
- [x] No tracking scripts or analytics

### Page Weight Targets

- **Total page weight**: < 50 KB (excluding logo images)
- **HTML**: ~6-8 KB
- **CSS**: ~4-5 KB
- **JS**: ~2 KB
- **Images**: ~10-20 KB (depending on logo optimization)

### Lighthouse Targets

Run Lighthouse in Chrome DevTools:

1. Open Chrome DevTools (F12)
2. Navigate to "Lighthouse" tab
3. Select "Mobile" mode
4. Check all categories
5. Click "Analyze page load"

**Expected scores:**

- **Performance**: ≥ 95
- **Accessibility**: ≥ 98 (aim for 100)
- **Best Practices**: ≥ 95
- **SEO**: ≥ 90

### Web Vitals Targets

- **LCP (Largest Contentful Paint)**: ≤ 2.0s
- **INP (Interaction to Next Paint)**: ≤ 200ms
- **CLS (Cumulative Layout Shift)**: ≤ 0.1

### Measurement Steps

1. **Using Chrome DevTools**
   ```
   F12 → Lighthouse → Generate report
   ```

2. **Using WebPageTest**
   - Go to [https://www.webpagetest.org/](https://www.webpagetest.org/)
   - Enter your deployed URL
   - Select "Mobile" and a test location
   - Run test and review Web Vitals

3. **Using PageSpeed Insights**
   - Go to [https://pagespeed.web.dev/](https://pagespeed.web.dev/)
   - Enter your deployed URL
   - Review mobile and desktop scores

## Manual Test Plan

### Keyboard Navigation Test

1. **Load page → press Tab**
   - First element should be "Skip to content" link
   - Skip link should be visible and styled

2. **Tab through header/navigation**
   - Logo and brand name visible
   - Navigation links receive focus in order
   - Focus ring is clear and visible

3. **Tab through main content**
   - All section headings are reachable
   - All links receive focus
   - Focus order is logical (top to bottom)

4. **Tab through contact form**
   - All form fields are reachable
   - Labels are visible
   - Submit button receives focus
   - Press Enter on submit button to submit form

5. **Test skip link**
   - Reload page
   - Press Tab once
   - Press Enter on "Skip to content"
   - Focus should jump to main content area

6. **Test anchor navigation**
   - Tab to navigation links
   - Press Enter on "Services", "Process", etc.
   - Page should scroll to corresponding section
   - Section should receive focus

### Screen Reader Test (NVDA Recommended)

**Setup:**
- Download NVDA (free): [https://www.nvaccess.org/download/](https://www.nvaccess.org/download/)
- Install and start NVDA
- Load the site in Firefox or Chrome

**Test procedures:**

1. **Navigate by headings**
   - Press `H` to jump between headings
   - Verify heading hierarchy: h1 → h2 → h3
   - Each section should have a clear h2 heading

2. **Navigate by landmarks**
   - Press `D` to jump between landmarks
   - Verify these are announced: header, navigation, main, footer

3. **Test logo and images**
   - Navigate to logo image
   - Verify alt text is "Orig logo" (concise and meaningful)

4. **Test links**
   - Navigate through all links
   - Verify link text is descriptive (e.g., "contact@orig-audits.example", not "click here")

5. **Test form**
   - Navigate to contact form
   - Verify each label is read with its corresponding field
   - Submit form with empty fields
   - Verify error messages are announced
   - Verify errors have `role="alert"` (should be announced automatically)

6. **Test skip link**
   - Reload page
   - Verify skip link is announced first
   - Activate skip link and verify focus moves to main content

### Visual Inspection

1. **Contrast check**
   - Use browser extension: [https://www.tpgi.com/color-contrast-checker/](https://www.tpgi.com/color-contrast-checker/)
   - Check text on gradient background
   - Check link colors
   - All should pass WCAG AA (4.5:1 minimum)

2. **Focus visibility**
   - Tab through entire page
   - Verify focus ring is visible on every interactive element
   - Focus should never disappear

3. **Layout stability**
   - Load page on slow connection (Chrome DevTools → Network → Slow 3G)
   - Verify content doesn't shift during load
   - Logo should have width/height attributes to reserve space

### Browser Testing

Test in the following browsers:

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest, if on macOS)
- **Edge** (latest)

Verify:
- Layout renders correctly
- Focus states are visible
- Form validation works
- No console errors

### Mobile Testing

1. **Responsive design**
   - Open DevTools → Toggle device toolbar
   - Test at 375px (iPhone), 768px (tablet), 1024px (desktop)
   - Verify layout adapts correctly
   - Text remains readable at all sizes

2. **Touch targets**
   - All buttons and links should be at least 44x44px
   - Form fields should be easy to tap

3. **Mobile performance**
   - Run Lighthouse in mobile mode
   - Performance should be ≥ 95

## Customization Guide

### Update Brand Colors

Edit `styles.css` CSS variables (lines 8-11):

```css
:root {
  --brand: #0B63CE;           /* Primary brand color */
  --brand-2: #4A8EE0;         /* Lighter variant */
  --brand-dark: #084A9C;      /* Darker variant for hover states */
}
```

### Update Contact Email

Replace `contact@orig-audits.example` in:

1. `index.html` line 109 (email link in contact section)
2. `index.html` line 248 (footer email)

### Update Company Name & Location

Edit `index.html` line 247-249 (footer section):

```html
<p>Orig &mdash; Independent accessibility and digital sobriety consultant</p>
<p>Location placeholder &middot; <a href="mailto:...">...</a></p>
```

### Adjust Gradient Background

Edit `styles.css` line 42:

```css
background: linear-gradient(135deg, #0A4A8F 0%, #1565B8 50%, #2A7FD9 100%);
```

## Known Issues & Limitations

- **Form submission**: Requires Netlify deployment to function. On local development, form will validate but not send.
- **Logo placeholder**: Logo files must be manually added to `assets/` folder before deployment.
- **Email address**: Update placeholder email addresses before going live.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No Internet Explorer support (uses modern CSS features)

## License & Credits

- Built with semantic HTML5, modern CSS, and vanilla JavaScript
- No external dependencies or third-party code
- System fonts used for zero external font requests
- Logo designed by client (files provided separately)

## Maintenance

### Regular Checks

- **Monthly**: Run Lighthouse audit to ensure performance stays optimal
- **Quarterly**: Test with latest screen reader versions (NVDA, JAWS, VoiceOver)
- **Annually**: Review against latest WCAG guidelines

### Updates Required

If any of the following change, update immediately:

- Contact email address
- Company location
- Service offerings
- Compliance standards referenced (currently WCAG 2.2 AA)

## Support & Questions

For technical questions about this implementation:

- Review WCAG 2.2 guidelines: [https://www.w3.org/WAI/WCAG22/quickref/](https://www.w3.org/WAI/WCAG22/quickref/)
- Test with NVDA screen reader: [https://www.nvaccess.org/](https://www.nvaccess.org/)
- Lighthouse documentation: [https://developer.chrome.com/docs/lighthouse/](https://developer.chrome.com/docs/lighthouse/)

---

**Built with accessibility, performance, and digital sobriety as core principles.**
