const fs = require('fs'); //fs module is built-in


//sync call...
//fs.writeFileSync('./text.txt', 'Hey there!');

//async call...
// fs.writeFile('./text.txt', 'Hey there!', (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('File written successfully!');
//     }
// });

// const result = fs.readFileSync('./contact.txt', 'utf-8', (err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });

// console.log(result)

// //Async .... non blocking
// fs.writeFile("./test.txt", "hello everyone");



// //sync .. blocking

// fs.writeFileSync("./test.txt", "hello everyone", (err)=> {})



console.log("1");
fs.readFileSync('contact.txt', 'utf8', (err, result) => {
    console.log(result)
});

console.log("2")
