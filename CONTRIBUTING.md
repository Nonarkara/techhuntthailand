# Contributing

## Local setup

```bash
npm ci
npm start
```

## Before opening a PR

```bash
npm test
```

## Content updates

- Directory data is generated from `รายงาน Technology Stock.docx`.
- Rebuild `data.js` with:

```bash
npm run build:data
```

## Pull request expectations

- Keep UI text trilingual where applicable (`en`, `th`, `zh` on the main showcase page).
- Preserve depa-first branding in top logo order.
- Ensure external feed failures still degrade gracefully (no broken screens).
