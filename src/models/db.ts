import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//The following retrieves variables defined in our .env file so that we can access our DB.
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB
} = process.env;

//set the URI to use the variables set in our .env
const uri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`;

export async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log(`Connected to DB: ${MONGO_DB}`);
    }
    catch (error) {
        console.error(`Failed to Connect to MongoDB: ${error}`);
        process.exit(1);
    }
}