import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { getFirebaseAdmin } from './config/firebase-admin.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(cors());
//getting the firebase app
try {
  getFirebaseAdmin();
  console.log(`Firebase has been initialized.`);
} catch (error) {
  console.error(`Firebase admin initialization is failed, ${error}`)
}


//setting cors and helmet for express app
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

//A simple logging for requests 
app.use((req: Request, res: Response, next: NextFunction) => {
  const timeStamp = new Date().toISOString();
  console.log(`[${timeStamp}: ${req.method} => ${req.path}]`)

  next()
});
//global request rate limitter 

const globalLimitter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false
});

app.use("/api/", globalLimitter);


//health checks 
//gateway healthcheck 
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: `ok`,
    timeStamp: new Date().toISOString(),
    upTime: process.uptime(),
    services: {
      gateway: `healthy`,
      userService: process.env.USER_SERCVICE_URL,
      contentService: process.env.CONTENT_SERVICE_URL
    }
  })
});

app.get("/health/sertvices", async (req: Request, res: Response) => {
  const services = {
    userService: { url: process.env.USER_SERCVICE_URL, status: "unknown" },
    contentService: { url: process.env.CONTENT_SERVICE_URL, status: "unknown" }
  }

  try {
    const userServiceResponse = await fetch(`${process.env.USER_SERCVICE_URL}/health`);
    services.userService.status = userServiceResponse.ok ? "healhty" : "unhealthy";
  } catch (error) {
    services.userService.status = "unreachable"
  }

  try {
    const contentServiceResponse = await fetch(`${process.env.CONTENT_SERVICE_URL}/health`);
    services.contentService.status = contentServiceResponse.ok ? "healhty" : "unhealthy";
  } catch (error) {
    services.contentService.status = "unreachable"
  }

  //pass the services health status
  const allHealthy = Object.values(services).every(s => s.status === "healthy");
  res.status(allHealthy ? 200 : 503).json({ services })

})





app.get('/api', (req: Request, res: Response) => {
  res.send('API Gatway is Up and Running!');
});


app.listen(PORT, () => {
  console.log(`API Gatway running on localhost:${PORT}`)
})
