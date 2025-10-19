"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//The following retrieves variables defined in our .env file so that we can access our DB.
const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;
//set the URI to use the variables set in our .env
const uri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`;
async function connectDB() {
    try {
        await mongoose_1.default.connect(uri);
        console.log(`Connected to DB: ${MONGO_DB}`);
    }
    catch (error) {
        console.error(`Failed to Connect to MongoDB: ${error}`);
        process.exit(1);
    }
}
