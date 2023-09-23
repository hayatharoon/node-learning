// const hello = 'Hello World';
// console.log(hello);

const fs = require('node:fs');

const text = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(text);
