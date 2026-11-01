# Intro video (home page hero)

The 12-second 3D intro in `public/intro/` is rendered from code, so it can be changed and re-made.

- `scene.js`: the Three.js scene (floating paperwork → phone → results → logo) and captions in English/Hindi.
- `index.html`: the 1280×720 stage, fonts and caption styles.
- `render.cjs`: opens the page in headless Chromium and saves each frame as PNG.

Re-render (run in a scratch folder with this folder's files copied in):

```bash
npm i three esbuild @fontsource/plus-jakarta-sans @fontsource/noto-sans-devanagari playwright
npx esbuild scene.js --bundle --format=iife --outfile=bundle.js
mkdir -p fr/en fr/hi
node render.cjs en 30 12 fr/en && node render.cjs hi 30 12 fr/hi
for l in en hi; do
  ffmpeg -y -framerate 30 -i fr/$l/f%04d.png -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -an intro-$l.mp4
  ffmpeg -y -i fr/$l/f0264.png -q:v 4 poster-$l.jpg
done
```

Then copy `intro-*.mp4` and `poster-*.jpg` into `public/intro/`. Note: `render.cjs` loads `file:///tmp/video/index.html`; change that path if you render elsewhere.
