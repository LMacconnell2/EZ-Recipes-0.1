import { connectDB } from "../models/db.js";
import { Users, UserTypes } from "../models/schema.js";
import mongoose from "mongoose";

export async function importUserTypes() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const userTypes = [
      { user_type_name: "editor" },
      { user_type_name: "admin" },
      { user_type_name: "super admin" },
    ];

    await UserTypes.deleteMany({});
    console.log("Cleared existing user types");

    const result = await UserTypes.insertMany(userTypes);
    console.log("User types imported successfully:");
    console.log(result);

  } catch (error) {
    console.error("Error importing user types:", error);
  }
}

export async function addUser() {
  try {
    await connectDB();

    const userType = await UserTypes.findOne({ user_type_name: "admin" });
    if (!userType) throw new Error("UserType not found");

    const newUser = new Users({
      fname: "Logan",
      lname: "MacConnell",
      email: "logan@example.com",
      password: "test1234",
      token: "",
      user_type: userType._id,
    });

    await newUser.save();
    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
  }
}