# Aathyanth Lekshman · Portfolio

Personal site built with React, Vite, [Motion](https://motion.dev), [Lenis](https://lenis.darkroom.engineering) smooth scroll and a React Three Fiber cricket ball. Everything here is free and open source.

## Run locally

```sh
bun install
bun run dev
```

## Edit content

- Projects, experience, skills, stats: `src/data.ts`
- Photos: `src/assets/photos/` (WebP, resized for the web)
- Résumé served from `public/Aathyanth_Lekshman_Resume.pdf`

## Deploy for free

Any static host works. The build output is `dist/`.

- **Vercel** or **Netlify**: import the GitHub repo. Build command `bun run build`, output directory `dist`.
- **GitHub Pages**: set `base: '/personal-portfolio/'` in `vite.config.ts`, build, and publish `dist/` with the official Pages action.
