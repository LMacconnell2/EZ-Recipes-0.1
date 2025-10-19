"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypes = exports.Users = exports.Recipes = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const recipeSchema = new mongoose_1.default.Schema({
    id: { type: Number, required: true },
    title: String,
    description: String,
    image: String,
    upload_date: { type: Date, required: true },
    categories: [String],
    ingredients: [String],
    instructions: [String],
});
const userTypeSchema = new mongoose_1.Schema({
    user_type_name: { type: String, required: true },
});
const userSchema = new mongoose_1.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    token: String,
    user_type: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserTypes", required: true },
    //This is not a relational database, therefore there isnt really such as thing as foreign keys. 
    //Therefore, we reference the user type found in the userTypeSchema to mimic the idea of a relational database.
});
exports.Recipes = mongoose_1.default.model("Recipes", recipeSchema);
exports.Users = mongoose_1.default.model("Users", userSchema);
exports.UserTypes = mongoose_1.default.model("UserTypes", userTypeSchema);
