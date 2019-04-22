//   Create a new file named restfulapi.js
//   Import the packages that we need and create an ExpressJS application:

const express = require("express");
const uuid = require("uuid");
const app = express();

//    Define an in-memory database:

let data = [{ id: uuid(), name: "Bob" }, { id: uuid(), name: "Alice" }];

//    Create a model which will contain functions for making CRUD operations:

const usr = {
  create(name) {
    const user = { id: uuid(), name };
    data.push(user);
    return user;
  },
  read(id) {
    if (id === "all") return data;
    return data.find(user => user.id === id);
  },
  update(id, name) {
    const user = data.find(usr => usr.id === id);
    if (!user) return { status: "User not found" };
    user.name = name;
    return user;
  },
  delete(id) {
    data = data.filter(user => user.id !== id);
    return { status: "deleted", id };
  }
};

//    Add a request handler for the post method that will be used as a Create operation. A new user will be added to the data array:

app.post("/users/:name", (req, res) => {
  res.status(201).json(usr.create(req.params.name));
});

//    Add a request handler for the get method that will be used as a Read or Retrieve operation. If an id is given, look for the user in the data array. However, If the given id is "all", it will return the whole list of users:

app.get("/users/:id", (req, res) => {
  res.status(200).json(usr.read(req.params.id));
});

//    Add a request handler for the put method that will be used as an Update operation. An id needs to be provided in order to update a specific user in the data array:

app.put("/users/:id=:name", (req, res) => {
  res.status(200).json(usr.update(req.params.id, req.params.name));
});

//   Add a request handler for the delete method that will be used as a Delete operation. It will look for the user in the data array and remove it:

app.delete("/users/:id", (req, res) => {
  res.status(200).json(usr.delete(req.params.id));
});

//    Start your application listening on port 1337 for new connections:

app.listen(1337, () => console.log("Web Server running on port 1337"));
