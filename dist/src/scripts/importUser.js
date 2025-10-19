"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUserTypes = importUserTypes;
exports.addUser = addUser;
const db_js_1 = require("../models/db.js");
const schema_js_1 = require("../models/schema.js");
async function importUserTypes() {
    try {
        await (0, db_js_1.connectDB)();
        console.log("Connected to MongoDB");
        const userTypes = [
            { user_type_name: "editor" },
            { user_type_name: "admin" },
            { user_type_name: "super admin" },
        ];
        await schema_js_1.UserTypes.deleteMany({});
        console.log("Cleared existing user types");
        const result = await schema_js_1.UserTypes.insertMany(userTypes);
        console.log("User types imported successfully:");
        console.log(result);
    }
    catch (error) {
        console.error("Error importing user types:", error);
    }
}
async function addUser() {
    try {
        await (0, db_js_1.connectDB)();
        const userType = await schema_js_1.UserTypes.findOne({ user_type_name: "admin" });
        if (!userType)
            throw new Error("UserType not found");
        const newUser = new schema_js_1.Users({
            fname: "Logan",
            lname: "MacConnell",
            email: "logan@example.com",
            password: "test1234",
            token: "",
            user_type: userType._id,
        });
        await newUser.save();
        console.log("User added successfully");
    }
    catch (error) {
        console.error("Error adding user:", error);
    }
}
