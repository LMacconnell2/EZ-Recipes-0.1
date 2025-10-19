import { connectDB } from "../models/db.js";
import { Recipes } from "../models/schema.js";
import fs from "fs";
import path from "path";

export async function importRecipes() {
  try {
    await connectDB();

    const filePath = path.join(__dirname, "../models/recipes.json"); // make sure recipes.json is in the same folder
    const data = fs.readFileSync(filePath, "utf-8");
    const recipes = JSON.parse(data);

    await Recipes.deleteMany({});

    await Recipes.insertMany(recipes);

    console.log("Recipes imported successfully");
  } catch (error) {
    console.error("Error importing recipes:", error);
  }
}