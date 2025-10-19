# Overview

Published 10-18-2025

The purpose of this project was to integrate a MongoDB NoSQL database behind my previously created EZ Recipes project written in Typescript. Most everything related to adding this function has been kept in separate files which can be found at:

- dist/src/pages/dashboard.ejs
- dist/src/pages/login.ejs
- src/scripts/importRecipes.ts
- src/scripts/importUser.ts
- src/models/db.ts
- src/models/schema.ts

- significant changes to server.ts to account for querying data from the DB as opposed to using a JSON file


This project is a recipe website which accomplishes the following:
- Queries data from a MongoDB database.
- takes the data and creates objects for each recipe via a class with a constructor and methods for returning HTML as strings. 
- dynamically update HTML by using the methods found in the aforementioned Recipe class and data retrived from URL or search parameters.
- take user input to update HTML content. (Search Page)
- Includes a simple dashboard allowing a user to add, edit, or remove recipes on the site. Changes made will be reflected upon reloading the page.
- The dashboard also includes a ResetDB button to restore the DB to its default data.
- If the user wishes to access the dashboard, they will be prompted to log in if they are not logged in already. 
- Once a user is logged in, a session is created which will ensure that they do not have to log in again when navigating different pages.

Demonstration of the project and further explanation: https://drive.google.com/file/d/1lqmSkroCRzGaK5Bo5ScOhxrzWWUlsrFt/view?usp=drive_link 
Code Repository: https://github.com/LMacconnell2/EZRecipes0.1

# Development Environment

VSCode is my IDE of choice. It is an industry standard and has access to many useful extensions.
Node.js - Server solution/NPM provides access to useful packages.
Express - Routing solution
EJS Modules - solution for dynamic HTML and easy insertion of variables/HTML
MongoDB - NoSQL Database solution

Docker command used: 
docker run -d -p 5000:27017 --name EZRecipesDB -e MONGO_INITDB_ROOT_USERNAME=dbAdmin -e MONGO_INITDB_ROOT_PASSWORD=asecretpassword mongo

Typescript v5.9.2

ChatGPT v4 - assistance in troubleshooting and syntax suggestions

# Useful Websites

https://www.mongodb.com/resources/basics/databases/cloud-databases
https://www.mongodb.com/docs/manual/
https://www.mongodb.com/resources/products/compatibilities/docker


# Future Work

- Currently the site only has 3 working pages. In the future, I may add additional content and capabilites to allow for users to send messages to admins, allow for user types, include a dashboard and flesh out incomplete or nonexistant routes/links.
- I had initially intended to connect an API to the site, I would lke to work with API's more in the future, including on this site.
- There is not yet a way to edit recipes or user information other than overwriting it. Ideally, there would be a list of recipes on the dashboard which would allow the user to select which ones to edit/delete. 