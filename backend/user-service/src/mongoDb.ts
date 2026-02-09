import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const URI = `${process.env.MONGO_URI}`;

export async function connectMDB() {

  try {

    await mongoose.connect(URI);
    console.log("Successfully COnnected to MongoDB")


  } catch (e) {
    console.error("Error Connecting to MongoDB :" + e)
  }


}
