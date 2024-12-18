import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { connectToDatabase } from './database';

dotenv.config();

const app = express();

app.use(routes);

const port = process.env.PORT || 3000;
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`);
  })
});

export default app;