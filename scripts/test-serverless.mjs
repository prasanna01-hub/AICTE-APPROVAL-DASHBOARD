import http from 'node:http';
import handler from '../deploy/aicte-approval-api/api/index.js';

http
  .createServer(async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error('handler error', err);
      res.writeHead(500).end('error');
    }
  })
  .listen(3200, () => console.log('serverless bundle listening on 3200'));
