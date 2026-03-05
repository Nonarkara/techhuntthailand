# Smart City Thailand Tech Hunt Directory

Public-facing, trilingual (English / Thai / Mandarin) showcase hub for the Smart City Thailand Tech Hunt program, assembled by **Dr Non (depa)** in collaboration with partner organizations.

The project combines:
- a searchable 160-entry startup and solution directory mapped to the 7 smart domains
- verified website links (with search fallbacks where not yet verified)
- a live Thailand pulse panel (map + city signals + earthquake context)
- additional pages for library, resources, and network mentions

## Tech Stack

- Static frontend: `index.html`, `styles.css`, `app.js`, `live-pulse.js`, `site-pages.js`
- Local Node server/API: `server.js`
- Data build pipeline: `scripts/build_directory_data.py` -> `data.js`

## Quick Start

```bash
npm ci
npm start
```

Open: `http://127.0.0.1:4173`

## Quality Checks

```bash
npm run check:syntax
npm run check:smoke
npm test
```

`npm run check:smoke` launches the server on a test port, validates core pages/assets, and checks API payload shapes.
In restricted local sandboxes where listening sockets are blocked, it automatically runs an offline integrity fallback check.

## Rebuild Directory Data

```bash
npm run build:data
```

Source file used by the generator:
- `รายงาน Technology Stock.docx`

## API Endpoints

- `GET /health` - service and cache health
- `GET /api/news` - startup + government news feed (with fallback payload if live feeds fail)
- `GET /api/pulse` - live map/pulse payload (with graceful fallback)
- `GET /api/network-news` - ecosystem mention feed (with fallback payload)
- `GET /api/library` - pillar/domain/track catalog from `data.js`
- `GET /api/resources` - reference sources and program assets

## Deployment

Blueprint for Render is included in `render.yaml`.

## Project Notes

- Logos are loaded from `public/` with **depa** as the primary mark.
- The directory is intended as an open reference.
- Please validate external websites, media claims, and vendor information before procurement or policy decisions.

## Contact

For startup submission requests (to add a new startup to the directory), contact **Dr Non at depa**.
