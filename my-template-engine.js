const express = require("express");
const fs = require("fs");
const app = express();

//Use the engine method to register a new template engine named tpl. We will read the file's content and replace %[var]% with the one specified in the options object:

app.engine("tpl", (filepath, options, callback) => {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      return callback(err);
    }
    const content = data.toString().replace(/%[a-z]+%/gi, match => {
      const variable = match.replace(/%/g, "");
      if (Reflect.has(options, variable)) {
        return options[variable];
      }
      return match;
    });
    return callback(null, content);
  });
});

//Define the path where the views are located. Our template is located in the views directory:

app.set("views", "./views");

//Tell ExpressJS to use our template engine:

app.set("view engine", "tpl");

//Add a route method to handle GET requests for path "/" and render our home template. Provide the title and description options which will replace %title% and %description% in our template:

app.get("/", (request, response, next) => {
  response.render("home", {
    title: "Hello",
    description: "World!"
  });
});

//Listen on port 1337 for new connections:

app.listen(1337, () => console.log("Web Server running on port 1337"));
