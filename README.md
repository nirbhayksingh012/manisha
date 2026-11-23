# Manisha Mishra — Portfolio Website

Production-ready static portfolio website for **Manisha Mishra (Content Strategist & Writer)**.

## 🚀 One-Click Hosting Options

This project is pre-configured and will **never break or 404** on any host:

### 1. Vercel
- Connect your GitHub repository to [Vercel](https://vercel.com).
- Vercel automatically reads `vercel.json` and serves `site/` as the root directory with clean URLs.

### 2. Netlify
- Connect your GitHub repository or drag-and-drop the project folder to [Netlify](https://netlify.com).
- Netlify automatically reads `netlify.toml` (`publish = "site"`) with security headers and caching enabled.

### 3. GitHub Pages
- Go to your repository settings -> **Pages**.
- Set branch to `main` and directory to `/ (root)`. The root redirect automatically routes visitors to `site/`.
- Alternatively, upload or deploy the contents of the `site/` folder directly.

### 4. Local Testing
```powershell
cd site
python -m http.server 3000
# or: npx serve site
```
Visit `http://localhost:3000`.

---

## 🛠 Project Structure
- `site/index.html`: Main HTML entry point
- `site/assets/style.css`: Bespoke editorial styles, responsive layouts & typography
- `site/assets/main.js`: Resilient animations (GSAP, ScrollTrigger, Lenis, Swiper, Tilt, GLightbox)
- `site/assets/img/`: WebP optimized image assets & SVG favicon
- `site/vendor/`: Bundled vendor libraries (no npm install required)

