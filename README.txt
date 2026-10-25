PRABATH SANDEEPA — PORTFOLIO (static site: HTML + CSS + JS)
============================================================

Open index.html in a browser, or upload the whole folder to Cloudflare Pages.
IMPORTANT: upload the CONTENTS of this folder (index.html must be at the root).

THINGS YOU REPLACE
------------------
1. Hero photo   ->  assets/images/hero-photo.jpg
2. About photo  ->  assets/images/about-photo.jpg
   Portrait photos, ratio 4:5 (for example 1200 x 1500 px) work best.
   Until these files exist, the page shows a placeholder automatically.
   Different file name or type (png/webp)? Edit the src="" of the two <img> in index.html.

3. Your CV      ->  assets/cv/Prabath-Sandeepa-CV.pdf
   (a placeholder PDF is there now; replace it with your real CV, same file name)

FOLDERS
-------
index.html            the page
css/style.css         all styling (dark/light tokens are at the top)
js/theme-init.js      applies the saved theme before first paint
js/main.js            hero slam, social hover effects, theme switch, Xenzura vault, certificate viewer
assets/certs/         certificate images (WebP)
assets/fonts/         Bricolage Grotesque (SIL Open Font License)
assets/images/        photo placeholders

LATER
-----
* New certificate: copy one <li class="cert"> block in index.html, add the image to assets/certs/.
* Xenzura stays a secret on purpose: the vault never opens.
