import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const URI = `${process.env.MONGO_URI}`;

async function connectMDB() {

  try {

    await mongoose.connect(URI);
    console.log("Successfully COnnected to MongoDB")


  } catch (e) {
    console.error('Error connecting to the database:', e.message);
    process.exit(1);


  }

}
