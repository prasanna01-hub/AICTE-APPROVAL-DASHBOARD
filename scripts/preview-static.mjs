// Minimal static file server that mimics Render's static site behaviour:
// serves files from the publish dir, falls back to index.html for unknown paths.
import express from 'express';
import path from 'node:path';

const dir = path.resolve(process.argv[2] || 'deploy/aicte-approval-portal');
const port = Number(process.argv[3] || 3411);
const app = express();

app.use(express.static(dir, { index: 'index.html', extensions: ['html'] }));
app.get('*', (_req, res) => res.sendFile(path.join(dir, 'index.html')));

app.listen(port, () => console.log(`static preview on http://localhost:${port}`));
