import express from "express";
import dotenv from "dotenv";

//route imports
import userRoutes from "./routes/userRoute.js";
import schoolRoutes from "./routes/schoolRoute.js";
import organizationRoutes from "./routes/organizationRoute.js";
import eventHostsRoutes from "./routes/eventHostsRoutes.js"
import clubRoutes from "./routes/clubRoute.js"
import skillRoutes from "./routes/skillRoute.js"
import { connectMDB } from "./mongoDb.js";

dotenv.config();

const app = express();

app.use(express.json());

connectMDB();



app.use((req, res, next) => {
  console.log(`📨 [User Service] Received: ${req.method} ${req.url}`);
  console.log(`   Headers: uid=${req.headers['x-user-uid']}, type=${req.headers['x-user-type']}`);
  next();
});


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'User Service' });
});

app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/skills", skillRoutes)
app.use("/api/event-hots", eventHostsRoutes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
