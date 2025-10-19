import path from "path";
import fs from "fs/promises"; //Needed this function so I could call the JSON file in a promise.

export async function loadRecipes(): Promise<Recipe[]> {
    try {
      //get the filepath in relation to the root directory
        const filePath = path.join(__dirname, "./recipes.json");
        //not necessarily the best way to go about it, but I chose to use fs as it would behave somewhat similar to a DB in that it is asynchronous
        const jsonData = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(jsonData);

        const recipes: Recipe[] = data.map( // grab the data and return it in the form of an object which can be used by the rest of the software
            (recipe: any) =>
                new Recipe(
                    recipe.id,
                    recipe.title,
                    recipe.description,
                    recipe.image,
                    recipe.upload_date,
                    recipe.categories,
                    recipe.ingredients,
                    recipe.instructions
                )
        );
        return recipes;
    }
    catch (error) {
        console.error("Error loeading Recipes: ", error);
        return [];
    }
}

export class Recipe { //each recipe is its own object, thus requiring a class
  id: number;
  title: string;
  description: string;
  image: string;
  upload_date: string;
  categories: string[];
  ingredients: string[];
  instructions: string[];

  constructor(
    id: number,
    title: string,
    description: string,
    image: string,
    upload_date: string,
    categories: string[],
    ingredients: string[],
    instructions: string[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.upload_date = upload_date;
    this.categories = categories;
    this.ingredients = ingredients;
    this.instructions = instructions;
  }

  // RecipeCardHTML takes the variables of the given object and inserts them into HTML. The HTML is returned by the method so that it can be inserted into each page when constructed.
  RecipeCardHTML(): string {
    const html = `<a class="recipe-card-link" href="/recipe/${this.id}">
                <section class="recipe-card">
                    <img class="recipe-card-img" src="/images/recipes/${this.id}.jpg" alt="${this.title} image">
                    <h3 class="recipe-card-title">${this.title}</h3>
                    <p class="recipe-card-date">${this.upload_date}</p>
                    <p class="recipe-card-desc">${this.description}</p>
                </section>
            </a>`;
    return html;
  }

  // Just like RecipeCardHTML, RecipePageHTML takes data and returns HTML as a string for use in our routes.
  RecipePageHTML(): string {
    let html = `<section class="recipe-details">
            <a href="/search" class="recipe-detail-return">Return to List</a>
            <img class="recipe-detail-img" src="/images/recipes/${this.id}.jpg" alt="recipe image">
            <h2 class="recipe-title">${this.title}</h2>
            <p class="recipe-date">Posted On: ${this.upload_date}</p>
            <p class="recipe-description-heading">Description:</p>
            <p class="recipe-description">${this.description}</p>
            <p class="recipe-categories-heading">Categories:</p>`;

    this.categories.forEach(category => {
      html += `<p class="recipe-categories">${category}</p>`;
    });

    html += `</section>
            <section class="recipe-instructions">
                <h3 class="recipe-ingredients-heading">Ingredients: </h3>`;

    this.ingredients.forEach(ingredient => {
      html += `<p class="recipe-ingredients">${ingredient}</p>`;
    });

    html += `<h3 class="recipe-steps-heading">Recipe: </h3>`;

    this.instructions.forEach((instruction, index) => {
      html += `<p class="recipe-steps">${index + 1}. ${instruction}</p>`;
    });

    html += `</section>`;

    return html;
  }
}