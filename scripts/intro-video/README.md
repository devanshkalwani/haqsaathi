# Intro video (home page hero)

The 12-second 3D intro in `public/intro/` is rendered from code, so it can be changed and re-made.

- `scene.js`: the Three.js scene (floating paperwork → phone showing the real site: quiz, results, scheme details → logo) and captions in English/Hindi.
- `capture-site.cjs`: takes the phone screenshots of the real website that `scene.js` shows. Run it with `npm run dev -- -p 3456` running, after any UI change.
- `index.html`: the 1280×720 stage, fonts and caption styles.
- `soundtrack.py`: synthesises the music (a bansuri flute melody on raag Bhupali over tanpura and a soft pad, one consistent tone). Needs numpy.
- `render.cjs`: opens the page in headless Chromium and saves each frame as PNG.

Re-render (run in a scratch folder with this folder's files copied in):

```bash
npm i three esbuild @fontsource/plus-jakarta-sans @fontsource/noto-sans-devanagari playwright
node capture-site.cjs   # needs the dev server on port 3456
npx esbuild scene.js --bundle --format=iife --outfile=bundle.js
python3 soundtrack.py intro.wav
mkdir -p fr/en fr/hi
node render.cjs en 30 12 fr/en && node render.cjs hi 30 12 fr/hi
for l in en hi; do
  ffmpeg -y -framerate 30 -i fr/$l/f%04d.png -i intro.wav -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -movflags +faststart intro-$l.mp4
  ffmpeg -y -i fr/$l/f0350.png -q:v 4 poster-$l.jpg
done
```

Then copy `intro-*.mp4` and `poster-*.jpg` into `public/intro/`. Note: `render.cjs` loads `file:///tmp/video/index.html`; change that path if you render elsewhere.
