"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importRecipes = importRecipes;
const db_js_1 = require("../models/db.js");
const schema_js_1 = require("../models/schema.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function importRecipes() {
    try {
        await (0, db_js_1.connectDB)();
        const filePath = path_1.default.join(__dirname, "../models/recipes.json"); // make sure recipes.json is in the same folder
        const data = fs_1.default.readFileSync(filePath, "utf-8");
        const recipes = JSON.parse(data);
        await schema_js_1.Recipes.deleteMany({});
        await schema_js_1.Recipes.insertMany(recipes);
        console.log("Recipes imported successfully");
    }
    catch (error) {
        console.error("Error importing recipes:", error);
    }
}
