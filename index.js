/*
*
* Author: Zsolt Gyula Angyal
* Title: Homework assignment#1
* Description: Hello World API
* Date: 2019.03.15
*
*/

// Dependecies
const http = require('http');
const url = require('url');


// Create the server
const httpServer = http.createServer((req, res)=>{
	// get the url
	const parsedUrl = url.parse(req.url, true);

	// get the path
	const path = parsedUrl.path;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	//get the query string as an object
	const queryStringObject = parsedUrl.query;

	// get the http method
	const method = req.method.toUpperCase();

	// get the headers
	const headers = req.headers;

	let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

	let data = {
		trimmedPath,
		queryStringObject,
		method,
		headers
	};

	chosenHandler(data, (statusCode, payload)=>{
		statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
		payload = typeof(payload) === 'object' ? payload : {};
		const payloadString = JSON.stringify(payload);
		res.setHeader('Content-Type', 'application/json');
		res.writeHead(statusCode);
		res.end(payloadString);

		console.log('This is the response code:' +statusCode+', and this is the content'+payloadString);
	});
});



httpServer.listen(3000, ()=>{
	console.log('The server is running on port 3000');
});

let handlers = {};

handlers.notFound = (data, callback)=>{
	let msg = {'Error': 'Page not found'};
	callback(404, msg);
};

handlers.hello = (data, callback)=>{
	let msg = {'Welcome': 'Hey, nice to meet you!'};
	callback(200, msg);
};

const router = {
	'hello': handlers.hello
};
