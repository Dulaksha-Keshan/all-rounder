import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client/extension";

//route imports
import userRoutes from "./routes/userRoute.js";
import schoolRoutes from "./routes/schoolRoute.js";
import organizationRoutes from "./routes/organizationRoute.js";


dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/organizations", organizationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
