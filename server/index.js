const http = require("http");
const fs = require("fs"); // Import fs module
const url = require("url");
const express = require("express");

const app = express();

app.get('/', (req, res)=>{
    return res.send("hello from home page");
});

app.get('/about', (req, res) =>{
    return res.send("hello from about page");
})



// const myServer = http.createServer((req, res) => {
//     const log = `${Date.now()}: ${req.method} ${req.url} New Request Received\n`;
//     const myUrl = url.parse(req.url);
//     console.log(myUrl.parse(req.url, true));
//     fs.appendFile("log.txt", log, (err) => {
//         if (err) {
//             console.error("Error writing to log file:", err);
//             res.statusCode = 500;
//             return res.end("Internal Server Error");
//         }

//         switch (myUrl.pathname) {
//             case '/':
//                 if(req.method === 'GET')res.end('HomePage')
//                 break;
//             case '/about':
//                 const userId = myUrl.query.userId;
//                 res.end(`I am Vansh, ${userId}`);

//                 break;
//             case '/signup':
//                 if(req.method === 'GET')res.end('This is a signup form');
//                 else if(req.method === "POST"){
//                     //DB query
//                     res.end("success");
//                 }
//             default:
//                 res.statusCode = 404;
//                 res.end("404 Not Found");
//         }
//     });
// });



app.listen(8000, () => console.log("Server started at port 8000"))
// const myServer = http.createServer(app);
// myServer.listen(8000, () => console.log("Server started at port 8000"));
