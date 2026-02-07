import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { getFirebaseAdmin } from './config/firebase-admin.js';
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyToken } from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js"


const app = express();

dotenv.config();

const PORT = process.env.PORT;

console.log(`${process.env.PORT} and ${process.env.USER_SERVICE_URL}`)

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
app.use(express.json())
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
      userService: process.env.USER_SERVICE_URL,
      contentService: process.env.CONTENT_SERVICE_URL
    }
  })
});


app.get("/health/services", async (req: Request, res: Response) => {
  const services = {
    userService: { url: process.env.USER_SERVICE_URL, status: "unknown" },
    contentService: { url: process.env.CONTENT_SERVICE_URL, status: "unknown" }
  }

  try {
    const userServiceResponse = await fetch(`${process.env.USER_SERVICE_URL}/health`);
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


//AUTH ROUTES
app.use('/api/auth', authRoutes);


//Public routes such  public viewing such as donations page as well will have a puclic route for content service 
app.use('/api/users/public',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/users/public': '/api/users/'
    },
    on: {
      error: (err, req, res) => {
        console.error("User service Proxy error: ", err);
        (res as Response).status(503).json({
          error: 'User service unavailable',
          message: 'Please try again later'
        })
      }
    }
  })
)


//Authentic user routes
app.use('/api/users',
  verifyToken,
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      '^/': '/api/users/'
    },
    on: {
      proxyReq: (proxyReq, req: Request) => {
        console.log(`[Proxy] Forwarding 1 to: ${req.url}`);
        if (req.user) {
          console.log(`[Proxy] Forwarding to: ${req.url}`);
          proxyReq.setHeader('x-User-uid', req.user.uid);
          proxyReq.setHeader('x-User-type', req.user.role);
          proxyReq.setHeader('x-user-email', req.user.email);
          if (req.user.schoolId) {
            proxyReq.setHeader('x-school-id', req.user.schoolId)
          }
        }
      },
      error: (err, req, res) => {
        console.error("User service Proxy error: ", err);
        (res as Response).status(503).json({
          error: 'User service unavailable',
        })
      }
    }
  })
);

// Schools routes
app.use('/api/schools',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/schools': '/api/schools'
    }
  })
);

// Organizations routes
app.use('/api/organizations',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/organizations': '/api/organizations'
    }
  })
);



app.get('/api', (req: Request, res: Response) => {
  res.send('API Gatway is Up and Running!');
});


app.listen(PORT, () => {
  console.log(`API Gatway running on localhost:${PORT}`)
})
