var http = require("http");  // Requires the http module and makes it accessible through the variable http

function onRequest(request,response) { 
    console.log("Request received.");
    response.writeHead(200, {"Content-type": "text/plain"});
    response.write("Hello World");
    response.end();
}

http.createServer(onRequest).listen(8888);

console.log("Server has started");
