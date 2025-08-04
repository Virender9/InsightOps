// Simple json-server wrapper so we can run a local mock API on port 4000
import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const server = jsonServer.create();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
