import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getFirebaseAdmin } from "./config/firebase-admin.js";
import {
  requireOrgAccess,
  requireRole,
  requireSchoolAccess,
  verifyToken,
} from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

console.log(`Port: ${PORT} | User Service: ${process.env.USER_SERVICE_URL}`);

//firebase initialization
try {
  getFirebaseAdmin();
  console.log("Firebase has been initialized.");
} catch (error) {
  console.error(`Firebase admin initialization failed: ${error}`);
}
//Global middleware for all requests
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} => ${req.path}`);
  next();
});

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", globalLimiter);


const userServiceProxy = (pathRewriteKey: string) =>
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    //pathRewrite: { "^/": `${pathRewriteKey}/` }, // pass-through, no rewrite needed
    on: {
      proxyReq: (proxyReq, req: Request) => {
        // forwarding the authenticated user info as headers to User Service
        if (req.user) {
          proxyReq.setHeader("x-user-uid", req.user.uid);
          proxyReq.setHeader("x-user-email", req.user.email || "");
          proxyReq.setHeader("x-user-type", req.user.role || "");
          if (req.user.schoolId) {
            proxyReq.setHeader("x-school-id", req.user.schoolId);
          }
          if (req.user.organizationId) {
            proxyReq.setHeader("x-organization-id", req.user.organizationId);
          }
        }
      },
      error: (err, req, res) => {
        console.error("User Service proxy error:", err);
        (res as Response).status(503).json({
          error: "User service unavailable",
          message: "Please try again later",
        });
      },
    },
  });

// health checks
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timeStamp: new Date().toISOString(),
    upTime: process.uptime(),
    services: {
      gateway: "healthy",
      userService: process.env.USER_SERVICE_URL,
      contentService: process.env.CONTENT_SERVICE_URL,
    },
  });
});

app.get("/health/services", async (req: Request, res: Response) => {
  const services = {
    userService: { url: process.env.USER_SERVICE_URL, status: "unknown" },
    contentService: { url: process.env.CONTENT_SERVICE_URL, status: "unknown" },
  };

  try {
    const r = await fetch(`${process.env.USER_SERVICE_URL}/health`);
    services.userService.status = r.ok ? "healthy" : "unhealthy";
  } catch {
    services.userService.status = "unreachable";
  }

  try {
    const r = await fetch(`${process.env.CONTENT_SERVICE_URL}/health`);
    services.contentService.status = r.ok ? "healthy" : "unhealthy";
  } catch {
    services.contentService.status = "unreachable";
  }

  const allHealthy = Object.values(services).every((s) => s.status === "healthy");
  res.status(allHealthy ? 200 : 503).json({ services });
});



// USER ROUTES
// All user routes require authentication
app.use(
  "/api/users",
  verifyToken,
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/users/"
    },
    on: {
      proxyReq: (proxyReq, req: Request) => {
        if (req.user) {
          proxyReq.setHeader("x-user-uid", req.user.uid);
          //proxyReq.setHeader("x-user-role", req.user.role || "");
          proxyReq.setHeader("x-user-email", req.user.email || "");
          proxyReq.setHeader("x-user-type", req.user.role || "");
          if (req.user.schoolId) {
            proxyReq.setHeader("x-school-id", req.user.schoolId);
          }
          if (req.user.organizationId) {
            proxyReq.setHeader("x-organization-id", req.user.organizationId);
          }
        }
      },
      error: (err, req, res) => {
        console.error("User Service proxy error:", err);
        (res as Response).status(503).json({ error: "User service unavailable" });
      },
    },
  })
);


// group 1 Public school reads
app.get("/api/schools", userServiceProxy("/api/schools"));
app.get("/api/schools/:id", userServiceProxy("/api/schools"));

// group 2 SUPER_ADMIN only operations
// coupled POST and DELETE share same role middleware
app.post(
  "/api/schools",
  verifyToken,
  requireRole("SUPER_ADMIN"),
  userServiceProxy("/api/schools")
);


// group 3 school scoped operations
const schoolScopedMiddleware = [
  verifyToken,
  requireRole("SCHOOL_ADMIN", "SUPER_ADMIN"),
  requireSchoolAccess("id"),
];

app.patch("/api/schools/:id", ...schoolScopedMiddleware, userServiceProxy("^/api/schools"));
app.get("/api/schools/:id/students", ...schoolScopedMiddleware, userServiceProxy("^/api/schools"));
app.get("/api/schools/:id/teachers", ...schoolScopedMiddleware, userServiceProxy("^/api/schools"));
app.get("/api/schools/:id/statistics", ...schoolScopedMiddleware, userServiceProxy("^/api/schools"));






// ORGANIZATION ROUTES

// group 1 public
app.get("/api/organizations", userServiceProxy("^/api/organizations"));
app.get("/api/organizations/:id", userServiceProxy("^/api/organizations"));

// group 2 super admin only
// coupled  POST and DELETE share same role middleware
const orgAdminOnlyMiddleware = [verifyToken, requireRole("SUPER_ADMIN")];

app.post("/api/organizations", ...orgAdminOnlyMiddleware, userServiceProxy("^/api/organizations"));
app.delete("/api/organizations/:id", ...orgAdminOnlyMiddleware, userServiceProxy("^/api/organizations"));

// group 3 org_admin update
app.patch(
  "/api/organizations/:id",
  verifyToken,
  requireRole("ORG_ADMIN", "SUPER_ADMIN"),
  requireOrgAccess("id"),
  userServiceProxy("^/api/organizations")
);





// CLUB ROUTES
// group 1 - stduent  only
//TODO: maybe we will add a club controller for the general list of clubs beacuse currently its fetching the user's schools clubs only 
app.get("/api/clubs", verifyToken, userServiceProxy("/api/clubs"));
app.get("/api/clubs/:id", verifyToken, userServiceProxy("/api/clubs"));


app.get("/api/clubs/members/:id", verifyToken, userServiceProxy("/api/clubs"));


app.get("/api/clubs/myClubs", verifyToken, userServiceProxy("/api/clubs"));

app.patch("/api/clubs/join/:id", verifyToken, requireRole("STUDENT", "TEACHER"), userServiceProxy("/api/clubs"));

app.patch("/api/clubs/leave/:id", verifyToken, requireRole("STUDENT", "TEACHER"), userServiceProxy("/api/clubs"));



const clubAdminMiddleware = [
  verifyToken,
  requireRole("SCHOOL_ADMIN", "SUPER_ADMIN"),
];

// group 2  schoold admin + school ownership
app.post("/api/clubs", ...clubAdminMiddleware, userServiceProxy("/api/clubs"));
app.patch("/api/clubs/:id", ...clubAdminMiddleware, userServiceProxy("/api/clubs"));
app.delete("/api/clubs/:id", ...clubAdminMiddleware, userServiceProxy("/api/clubs"));

// group 3 Student membership
// coupled  join and leave share same role middleware
const studentClubMiddleware = [verifyToken, requireRole("STUDENT")];

app.post("/api/clubs/:id/join", ...studentClubMiddleware, userServiceProxy("/api/clubs"));
app.delete("/api/clubs/:id/leave", ...studentClubMiddleware, userServiceProxy("/api/clubs"));

// ============================================
// SKILL ROUTES
// group 1 public skill list
app.get("/api/skills", userServiceProxy("/api/skills"));

// group 2 super admin creates new skill badges
app.post(
  "/api/skills",
  verifyToken,
  requireRole("SUPER_ADMIN"),
  userServiceProxy("/api/skills")
);

// ============================================
// EVENT HOST ROUTES (internal use)
app.use(
  "/api/event-hosts",
  verifyToken,
  userServiceProxy("/api/event-hosts")
);


app.use(express.json());

// auth routes directly handles by the api gateway too
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway running on localhost:${PORT}`);
});
