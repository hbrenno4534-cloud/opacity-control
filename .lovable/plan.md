

## Problem

The old pyramid favicon image is still being served because the actual image files (`public/favicon.png`, `public/front/images/favicon.png`, `public/back/images/favicon.png`) still contain the old pyramid image despite previous copy attempts. The browser also caches favicons aggressively.

## Plan

1. **Replace all favicon image files** with the uploaded "La Casa de Lucro" logo (`logo-removebg-preview-3.png`):
   - `public/favicon.png`
   - `public/front/images/favicon.png`
   - `public/back/images/favicon.png`
   - `public/front/images/apple-touch-icon.png`
   - `public/back/images/apple-touch-icon.png`
   - `public/front/images/favicon-16x16.png`
   - `public/front/images/favicon-32x32.png`
   - `public/back/images/favicon-16x16.png`
   - `public/back/images/favicon-32x32.png`

2. **Verify HTML references** — all 11 HTML files already point to `images/favicon.png` or `/favicon.png`, so no HTML changes are needed.

This ensures every possible favicon file across the entire site displays the La Casa de Lucro logo instead of the old pyramid.

