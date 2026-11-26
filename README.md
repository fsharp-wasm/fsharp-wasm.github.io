# FSharp WasmGC — Website

<!-- status -->
[![Deploy](https://github.com/fsharp-wasm/fsharp-wasm.github.io/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/fsharp-wasm/fsharp-wasm.github.io/actions/workflows/deploy.yml) · [Status of every repository](https://fsharp-wasm.github.io/status/)
<!-- /status -->

This repository contains the source code for the [fsharp-wasm.github.io](https://fsharp-wasm.github.io) website — the landing page, documentation, and blog for the **FSharp WasmGC** compiler project.

## About FSharp WasmGC

[FSharp WasmGC](https://github.com/fsharp-wasm/fsharp-wasm) is a clean-room compiler backend that compiles F# to [WebAssembly GC](https://github.com/WebAssembly/gc). It is built on top of [Fable](https://fable.io), replacing only the code generation backend with a WasmGC emitter.

- Write idiomatic F# — no special attributes or interop layers needed
- Get compact, self-contained `.wasm` modules with no JavaScript runtime
- Full WasmGC MVP compliance: struct types, array types, typed function references
- Component Model / WIT support for cross-module linking

## Website stack

Built with [Astro 5](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/), based on the [AstroWind](https://github.com/arthelokyo/astrowind) template.

Features:
- ✅ Static site generation — deploys to GitHub Pages
- ✅ MDX/Markdown blog with RSS feed
- ✅ Content-managed documentation (MD files in `src/content/docs/`)
- ✅ Dark mode support
- ✅ SEO optimised with Open Graph and sitemap

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
cd fsharp-wasm.github.io
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

### Build

```bash
npm run build
```

Output is in `dist/`.

### Preview production build

```bash
npm run preview
```

## Content structure

| Location | Purpose |
|----------|---------|
| `src/data/post/*.md` | Blog posts — add new `.md` or `.mdx` files here |
| `src/content/docs/*.md` | Documentation pages — add new docs here |
| `src/pages/index.astro` | Landing page |
| `src/pages/about.astro` | About page |
| `src/pages/benchmarks.astro` | Benchmarks (coming soon) |
| `src/pages/contact.astro` | Contact / community links |
| `src/navigation.ts` | Header and footer navigation |
| `src/config.yaml` | Site metadata, blog settings |
| `src/components/` | Reusable Astro components (AstroWind widgets) |

### Adding a blog post

Create a new file in `src/data/post/`:

```markdown
---
publishDate: 2026-04-01T00:00:00Z
author: Your Name
title: Your Post Title
excerpt: A one-sentence summary shown in blog list views.
category: Tutorials  # or: Announcements, Technical, Releases
tags:
  - fsharp
  - wasmgc
---

# Your Post

Content here in Markdown or MDX.
```

### Adding a documentation page

Create a new file in `src/content/docs/`:

```markdown
---
title: My New Doc
description: What this document covers.
order: 4  # controls sort order in the docs index
---

# My New Doc

Content here.
```

The page will appear automatically at `/docs/my-new-doc`.

## Deployment

The site deploys automatically to GitHub Pages on push to `main`. Static files are built by Astro and served from the `dist/` directory.

For Docker-based deployment, see [docker-compose.yml](docker-compose.yml) and [nginx/nginx.conf](nginx/nginx.conf).

## Attributions

- Website template: [AstroWind](https://github.com/arthelokyo/astrowind) by [Arthelokyo](https://github.com/arthelokyo) — MIT License (kept in `LICENSES/MIT-AstroWind.md`)
- Compiler foundation: [Fable](https://fable.io) — MIT License
- Sponsor: [Amano Services](https://www.amano.services/); the organisation takes sponsorship through [GitHub Sponsors](https://github.com/sponsors/fsharp-wasm)

## Contributing

Welcome. [CONTRIBUTING](https://github.com/fsharp-wasm/.github/blob/develop/CONTRIBUTING.md) is the organisation's guide and [AGENTS.md](AGENTS.md) says how the platform is worked on (the compiler comes first: a fault found here
is fixed in the compiler, not worked around here).

- **Run the tests:** `npm run build` builds the site; `npm run dev` serves it.
- **A good first contribution:** A page that confused you: fix it. Every number on the site must be one that a repository measured, with its date. Issues labelled [`good first issue`](https://github.com/fsharp-wasm/fsharp-wasm.github.io/labels/good%20first%20issue) are the places to start.
- **A change** goes to `develop` as a pull request, with a test that fails without it. Open an issue first for anything larger than a fix.

## License

Our content and code are [Apache License 2.0](LICENSE) (see [NOTICE](NOTICE)); the parts that come from the AstroWind template keep its MIT License, [LICENSES/MIT-AstroWind.md](LICENSES/MIT-AstroWind.md).

The FSharp WasmGC compiler (separate repository) is Apache License 2.0 as well: [https://github.com/fsharp-wasm/fsharp-wasm/blob/main/LICENSE](https://github.com/fsharp-wasm/fsharp-wasm/blob/main/LICENSE)
