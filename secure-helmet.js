const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const uuid = require("uuid/v1");
const app = express();

//Generate a random ID which will be used for nonce which is an HTML attribute used for whitelist which scripts or styles are allowed to be executed inline in the HTML code:

const suid = uuid();

//Use body parser to parse JSON request body for json and application/csp-report content types. application/csp-report is a content type that contains a JSON request body of type json which is sent by the browser when one or several CSP rules are violated:

app.use(
  bodyParser.json({
    type: ["json", "application/csp-report"]
  })
);

//Use the Content Security Policy middleware function to define directives. defaultSrc specifies where resources can be loaded from. The self option specifies to load resources only from your own domain. We will use none instead, which means that no resources will be loaded. However, because we are whitelisting scriptSrc, we will be able to load Javascript scripts but only the ones that have the nonce that we will specify. The reportUri is used to tell the browser where to send violation reports of our Content Security Policy:

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      // By default do not allow unless whitelisted
      defaultSrc: [`'none'`],
      // Only allow scripts with this nonce
      scriptSrc: [`'nonce-${suid}'`],
      reportUri: "/csp-violation"
    }
  })
);

//Add a route method to handle POST request for path "/csp-violation" to receive violation reports from the client:

app.post("/csp-violation", (request, response, next) => {
  const { body } = request;
  if (body) {
    console.log("CSP Report Violation:");
    console.dir(body, { colors: true, depth: 5 });
  }
  response.status(204).send();
});

//Use the DNS Prefetch Control middleware to disable prefetch of resources:

app.use(helmet.dnsPrefetchControl({ allow: false }));

//Use the Frameguard middleware function to disable your application from being loaded inside a iframe:

app.use(helmet.frameguard({ action: "deny" }));

//Use the hidePoweredBy middleware function to replace the X-Powered-By header and set a fake one:

app.use(
  helmet.hidePoweredBy({
    setTo: "Django/1.2.1 SVN-13336"
  })
);

////Use the ieNoOpen middleware function to disable IE untrusted executions:

app.use(helmet.ieNoOpen());

//Use the noSniff middleware function to disable mime-type guessing:

app.use(helmet.noSniff());

//Use the referrerPolicy middleware function to make the header available only for our domain:

app.use(helmet.referrerPolicy({ policy: "same-origin" }));

//Use the xssFilter middleware function to prevent Reflected XSS attacks:

app.use(helmet.xssFilter());

//Add a route method to handle GET requests on path "/" and serve a sample HTML content that will try to load an image from an external source, try to execute an inline script, and try to load an external script without a nonce specified. We will add a valid script as well that is allowed to be executed because a nonce attribute will be specified:

app.get("/", (request, response, next) => {
  response.send(` 
   <!DOCTYPE html> 
   <html lang="en"> 
   <head> 
       <meta charset="utf-8"> 
       <title>Web App</title> 
   </head> 
    <body> 
       <span id="txtlog"></span> 
        <img alt="Evil Picture" src="http://evil.com/pic.jpg"> 
       <script> 
            alert('This does not get executed!') 
        </script> 
        <script src="http://evil.com/evilstuff.js"></script> 
        <script nonce="${suid}"> 
            document.getElementById('txtlog') 
              .innerText = 'Hello World!' 
        </script> 
     </body> 
   </html> 
 `);
});

//Listen on port 1337 for new connections:

app.listen(1337, () => console.log("Web Server running on port 1337"));
