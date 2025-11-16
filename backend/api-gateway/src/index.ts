import express, { type Request, type Response } from 'express';
import 'dotenv/config';
import cors, { type CorsOptions } from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors());

app.get('/api', (req: Request, res: Response) => {
  res.send('API Gatway is Up and Running!');
});


app.listen(PORT, () => {
  console.log(`API Gatway running on localhost:${PORT}`)
})
