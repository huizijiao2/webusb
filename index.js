'use strict';

const https = require('https');
const fs = require('fs');
const node_static = require('node-static');
let options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
};
var fileServer = new node_static.Server('./public');
https.createServer(options, (request, response)=>{
    console.info("request:" + request);
    request.addListener('end', function () {
        //
        // Serve files!
        //
        console.info(request);
        fileServer.serve(request, response, function (err, result) {
            if (err) { // There was an error serving the file
                console.error("Error serving " + request.url + " - " + err.message);

                // Respond to the client
                response.writeHead(err.status, err.headers);
                response.end();
            }else{
                console.info("request coming.");
            }
        });
        
    }).resume();
}).listen(8080);