const express = require("express");
const app = express();
const debug = require("debug")("myapp");
app.get("*", (request, response, next) => {
  debug("Request:", request.originalUrl);
  response.send("Hello there!");
});
app.listen(1337, () => console.log("Web Server running on port 1337"));

/*
!!!!!!!!!!!!!!!!!!!!!!!!run this in cmd, not powershell
Save the file
Open a terminal and run:
On Windows:

set DEBUG=myapp node myapp.js

On Linux and MacOS:

DEBUG=myapp node myapp.js

In your web browser, navigate to:
Observe your Terminal's output. It would display something like:

Web Server running on port 1337 
  myapp Request: / +0ms 

You can use the DEBUG environment variable to tell the debug module to displays logs not only for myapp but also for ExpressJS like so:

On Windows:

set DEBUG=myapp,express:* node myapp.js 

On Linux and MacOS:

DEBUG=myapp,express:* node myapp.js
*/
