# Contributing

## Local setup

```bash
npm ci
npm start
```

Open `http://127.0.0.1:4173`.

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

Do not hand-edit generated rows and expect the next build to keep them.

## Pull request expectations

- Keep UI text trilingual where applicable (`en`, `th`, `zh` on the showcase pages).
- Preserve the existing on-page partner-mark order unless you are documenting a real change.
- Ensure external feed failures still degrade gracefully (no broken screens).
- Do not commit `.env`, tokens, or credentials. None are required to run the directory.
- Do not invent live URLs, rankings, or awards that are not in this tree.

See the README sections **Ethical use** and **License / contributing**.
