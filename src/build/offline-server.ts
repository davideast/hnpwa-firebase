import * as express from 'express';
import { app as router } from '../server';

const app = express();
app.use(router);

const PORT = process.env['PORT'] || 3004;
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
