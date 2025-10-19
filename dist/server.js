"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const schema_js_1 = require("./src/models/schema.js");
const express_session_1 = __importDefault(require("express-session"));
const importRecipes_js_1 = require("./src/scripts/importRecipes.js");
//the following import has been added in v0.1 of the site, (mongoDB addition)
const db_1 = require("./src/models/db");
// Set the PORT and define app as using express.
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; //Grab our port number from our ENV file
(0, db_1.connectDB)();
//I used EJS modules for the project, the following three lines define the view engine and where views and static files can be found.
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "./src/pages"));
app.use(express_1.default.static(path_1.default.join(__dirname, "./src")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set true if using HTTPS
}));
// the home page route
//v0.1 - The route has changed to draw data from the DB as opposed to a JSON file
app.get("/", async (req, res) => {
    try {
        const allRecipes = await schema_js_1.Recipes.find({}).lean();
        const sortedRecipes = allRecipes.sort((a, b) => {
            const dateA = new Date(a.upload_date).getTime();
            const dateB = new Date(b.upload_date).getTime();
            return dateB - dateA;
        });
        const featuredRecipes = sortedRecipes.slice(0, 6); // I only want 6, 10 doesnt fit cleanly on a page :(
        // in the Recipe class, I created a method called RecipeHTML which returns the HTML for a single recipe card as a string.
        // By mapping the sorted data in the object to each iteration of the method, I was able to produce an html list including all the featured recipes.
        const listHTML = featuredRecipes.map(recipe => `<a class="recipe-card-link" href="/recipe/${recipe.id}">
                <section class="recipe-card">
                    <img class="recipe-card-img" src="/images/recipes/${recipe.id}.jpg" alt="${recipe.title} image">
                    <h3 class="recipe-card-title">${recipe.title}</h3>
                    <p class="recipe-card-date">${recipe.upload_date}</p>
                    <p class="recipe-card-desc">${recipe.description}</p>
                </section>
            </a>`).join("");
        //EJS modules then renders the page with all necessary variables.
        res.render("index", {
            title: "EZ Recipes - Home",
            listHTML
        });
    }
    catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).send("Failed to load recipes.");
    }
});
// the search route is the page where a user may search for a recipe by name or category.
//v0.1 - The route has changed to draw data from the DB as opposed to a JSON file
app.get("/search", async (req, res) => {
    try {
        // set the variables necessary to filter the data, be it from the form on the page || a default value.
        const search = req.query.search || "";
        const categories = req.query.categories;
        const order = req.query.order || "alphabet";
        const direction = req.query.direction || "asc";
        //These logs were the most helpful part of diagnosing errors in the way data was being passed from the form, to the URL, and from there to my filters.
        console.log(`Search: ${search}`);
        console.log(`Categories: ${categories}`);
        console.log(`Order: ${order}`);
        console.log(`Direction: ${direction}`);
        const filter = {};
        if (search) {
            filter.title = { $regex: search, $options: "i" }; // AI assisted in the creation of these Regular Expressions, its something I am not yet well versed in.
        }
        if (categories) {
            let categoryArray;
            if (Array.isArray(categories)) {
                categoryArray = categories.map(c => c.toString().toLowerCase());
            }
            else {
                categoryArray = [categories.toString().toLowerCase()];
            }
            filter.categories = { $in: categoryArray };
        }
        let sort = {};
        if (order === "date") {
            sort.upload_date = direction === "desc" ? -1 : 1;
        }
        else if (order === "alphabet") {
            sort.title = direction === "desc" ? -1 : 1;
        }
        const dbRecipes = await schema_js_1.Recipes.find(filter).sort(sort).lean();
        //html is created and sent as a string to be displayed
        const listHTML = dbRecipes.map(recipe => `<a class="recipe-card-link" href="/recipe/${recipe.id}">
                <section class="recipe-card">
                    <img class="recipe-card-img" src="/images/recipes/${recipe.id}.jpg" alt="${recipe.title} image">
                    <h3 class="recipe-card-title">${recipe.title}</h3>
                    <p class="recipe-card-date">${recipe.upload_date}</p>
                    <p class="recipe-card-desc">${recipe.description}</p>
                </section>
            </a>`).join("");
        //render the page
        res.render("list", {
            title: "EZ Recipes - Search Results",
            listHTML
        });
    }
    catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).send("Error fetching recipes.");
    }
});
//This route changes based upon the number found after /recipe/ the number is the ID of the recipe. By using this number, the correct data can be retrieved from our cached list of objects.
app.get("/recipe/:id", async (req, res) => {
    const recipeId = parseInt(req.params.id);
    try {
        const recipe = await schema_js_1.Recipes.findOne({ id: recipeId }).lean();
        if (!recipe) {
            return res.status(404).send("Recipe not found");
        }
        // as opposed to using the class with the html method, I included the HTML construction here.
        let html = `<section class="recipe-details">
            <a href="/search" class="recipe-detail-return">Return to List</a>
            <img class="recipe-detail-img" src="/images/recipes/${recipe.id}.jpg" alt="recipe image">
            <h2 class="recipe-title">${recipe.title}</h2>
            <p class="recipe-date">Posted On: ${recipe.upload_date}</p>
            <p class="recipe-description-heading">Description:</p>
            <p class="recipe-description">${recipe.description}</p>
            <p class="recipe-categories-heading">Categories:</p>`;
        recipe.categories.forEach(category => {
            html += `<p class="recipe-categories">${category}</p>`;
        });
        html += `</section>
            <section class="recipe-instructions">
                <h3 class="recipe-ingredients-heading">Ingredients: </h3>`;
        recipe.ingredients.forEach(ingredient => {
            html += `<p class="recipe-ingredients">${ingredient}</p>`;
        });
        html += `<h3 class="recipe-steps-heading">Recipe: </h3>`;
        recipe.instructions.forEach((instruction, index) => {
            html += `<p class="recipe-steps">${index + 1}. ${instruction}</p>`;
        });
        html += `</section>`;
        res.render("recipe", {
            title: `EZ Recipes - ${recipe.title}`,
            html,
        });
    }
    catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).send("Failed to load recipe.");
    }
});
//New route created for v0.1 - This route is the default dashboard route. It will only allow users who are logged in to view it.
app.get("/dashboard", (req, res) => {
    if (req.session.user) {
        res.render("dashboard", {
            title: "EZ Recipes Dashboard"
        });
    }
    else {
        res.redirect("login");
    }
});
//This is just a route which calls a function to reset the data in the DB - Added v0.1
app.get("/reset-db", (req, res) => {
    if (req.session.user) {
        (0, importRecipes_js_1.importRecipes)();
        res.redirect("/");
    }
    else {
        res.redirect("login");
    }
});
//This is the POST route which will add recipes to the DB - Added v0.1
app.post("/new-recipe", async (req, res) => {
    try {
        const { id, title, description, image, upload_date, categories, ingredients, instructions } = req.body;
        const newRecipe = new schema_js_1.Recipes({ id, title, description, image, upload_date, categories, ingredients, instructions });
        await newRecipe.save();
        res.status(201).send("Recipe Added Successfully!");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});
//This is the post route which will add users to the DB - Added v0.1
app.post("/add-user", async (req, res) => {
    try {
        const { fname, lname, email, password, token, user_type } = req.body;
        const newUser = new schema_js_1.Users({ fname, lname, email, password, token, user_type, });
        await newUser.save();
        res.status(201).send("User Added Successfully!");
    }
    catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("Something went wrong");
    }
});
// sends the user to the login page
app.get("/login", (req, res) => {
    res.render("login", {
        title: "EZ Recipes Login"
    });
});
// This will run when the user submits the form found on the login page - Added v0.1
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await schema_js_1.Users.findOne({ email });
        if (!user) {
            return res.status(401).send("This email does not exist. ");
        }
        if (user.password !== password) {
            return res.status(401).send("Invalid Password");
        }
        req.session.user = { email };
        res.redirect("/dashboard");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("A server error occured.");
    }
});
//I created a logout route as well, although I do not yet have it linked anywhere - Added v0.1
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
// Because we call async functions, the server startup also needed to be housed inside an async function.
async function startServer() {
    // await importUserTypes(); //Imports the user types
    // await addUser();//Adds a basic user so I can then add others. Data in the DB remains even when shut down due to how I created it. :)
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
startServer();
