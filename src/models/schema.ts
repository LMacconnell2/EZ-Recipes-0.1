import mongoose, { Schema } from "mongoose";

const recipeSchema = new mongoose.Schema({
    id: {type: Number, required: true },
    title: String,
    description: String,
    image: String,
    upload_date: { type: Date, required: true },
    categories: [String],
    ingredients: [String],
    instructions: [String],
});

const userTypeSchema = new Schema({
  user_type_name: { type: String, required: true },
});

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  token: String,
  user_type: { type: Schema.Types.ObjectId, ref: "UserTypes", required: true }, 
  //This is not a relational database, therefore there isnt really such as thing as foreign keys. 
  //Therefore, we reference the user type found in the userTypeSchema to mimic the idea of a relational database.
});

export const Recipes = mongoose.model("Recipes", recipeSchema);
export const Users = mongoose.model("Users", userSchema);
export const UserTypes = mongoose.model("UserTypes", userTypeSchema);