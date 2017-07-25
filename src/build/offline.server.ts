import * as express from 'express';
import { app as router } from '../server';

const app = express();
app.use(router);
app.use(express.static(process.cwd() + '/dist/static'));

const PORT = process.env['PORT'] || 3004;
const API_BASE = process.env['API_BASE'] || 'http://localhost:3002';
app.listen(PORT, () => console.log(`Listening on ${PORT}. Using API: ${API_BASE}`));
