# FormatDesk Lite

[![CI](https://github.com/Jarvis-123/formatdesk-lite/actions/workflows/ci.yml/badge.svg)](https://github.com/Jarvis-123/formatdesk-lite/actions/workflows/ci.yml)

**Client-side PDF merge** in the browser using [pdf-lib](https://pdf-lib.js.org/).

No server upload. No Gotenberg/Stirling. No employer documents — merge your own PDFs locally.

## Features

- Multi-file PDF picker / drag area
- Reorder before merge
- Page count per file
- Download `merged.pdf`

## Quick start

```bash
npm install
npm run dev
```

## Why this exists

Merging a few PDFs usually means uploading documents you would rather not hand to a random web converter. This does the merge with `pdf-lib` in the browser, so the files never leave the machine — there is no server to send them to.

**Live demo:** https://formatdesk-lite.vercel.app · **Repository:** https://github.com/Jarvis-123/formatdesk-lite

## License

MIT
