import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { connectToDatabase } from './database';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("combined"));

app.use(routes);

const port = process.env.PORT || 3000;
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`);
  })
});

export default app;