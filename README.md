# Frontier Atlas

AI Research Discovery Platform — pixel-faithful clone of the Frontier Atlas design.

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v3**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/
│   ├── globals.css      ← Theme tokens, fonts, base styles
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx   ← Fixed top navigation bar
│   │   ├── Sidebar.tsx  ← Fixed left sidebar with all nav sections
│   │   └── Footer.tsx   ← Dark footer with 5-column grid
│   └── home/
│       ├── HeroSection.tsx   ← "Discover AI Research" hero + 3D cube
│       ├── TimeTabs.tsx      ← Today / This Week / This Month / All time
│       └── PaperCard.tsx     ← Paper card with tags, methods, stats
```

## Design Tokens (globals.css)

| Token | Value |
|-------|-------|
| `--color-brand-red` | `#E8442A` |
| `--color-brand-orange` | `#F97316` |
| `--color-bg` | `#ffffff` |
| `--color-border` | `#e5e5e5` |
| `--sidebar-width` | `220px` |
| `--topbar-height` | `52px` |
# Frontier-Atlas
