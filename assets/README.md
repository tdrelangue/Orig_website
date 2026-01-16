# Assets Folder

## Logo Files Required

Please add your logo files to this folder before deploying the site:

1. **logo.png** - Logo with light background (for use on dark backgrounds)
2. **logo-removebg-preview.png** - Logo with transparent background (currently referenced in HTML)

### Requirements

- Format: PNG recommended for transparency support
- Dimensions: Approximately 60x60px (or larger, scaled to 60px in CSS)
- Optimization: Use tools like TinyPNG or ImageOptim to reduce file size
- Target size: < 20 KB per image for optimal performance

### Current Configuration

The site currently uses `logo-removebg-preview.png` in the header. To change this:

1. Edit `index.html` line 21
2. Update the `src` attribute to point to your preferred logo file

### Optimization Tips

- Use PNG-8 if logo has limited colors (smaller file size)
- Use PNG-24 if logo requires full transparency
- Consider WebP format for modern browsers (with PNG fallback)
- Always include width and height attributes to prevent layout shift
