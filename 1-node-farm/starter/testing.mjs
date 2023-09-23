import { readFileSync, writeFileSync, readFile, writeFile } from 'fs';
import { createServer } from 'node:http';
import url from 'node:url';
import path from 'path';
import { fileURLToPath } from 'url';
import replaceTemplate from './modules/replaceTemplate.mjs';
import slugify from 'slugify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//? Blocking way to read and write the file
// const text = readFileSync('./txt/input.txt', 'utf-8');
// console.log(text);

// const textOut = `Hey, I am on the way to become Full Stack Developer from ${Date.now()}`;
// writeFileSync('./txt/output.txt', textOut);
// console.log('The File has been successfully Write');

//? Non-Blocking way to read and write the file
// readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);
//       writeFile('./txt/final.txt', `${data2} \n ${data3}`, (err) => {
//         console.log('The file has been successfully write 😁');
//       });
//     });
//   });
// });
// console.log('me first');

//? Server

const data = readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

//* Create a slug for every product:
const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
    replacement: '-',
  })
);
console.log(slugs);

//* creating a server
const server = createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  console.log(pathname);
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});

//? Routing...
