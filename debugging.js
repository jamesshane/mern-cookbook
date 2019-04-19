const express = require("express");
const app = express();

//Add a route method to handle GET requests for any path:

app.get("*", (request, response, next) => {
  response.send("Hello there!");
});

//Listen on port 1337 for new connections:

app.listen(1337, () => console.log("Web Server running on port 1337"));

/*

!!!!!!!!!!!!!!!!!!!!!!!!run this in cmd, not powershell

On Windows:

set DEBUG=express:* node debugging.js

On Linux or MacOS:

DEBUG=express:* node debugging.js 

In your web browser, navigate to:

http://localhost:1337/

Observe your terminal's output for logs
*/
