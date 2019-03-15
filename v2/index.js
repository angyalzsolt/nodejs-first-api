/*
*
* Author: Zsolt Gyula Angyal
* Title: Homework assignment#1 v2.0
* Description: Hello World API with https 
* Date: 2019.03.15
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');


const httpServer = http.createServer((req, res)=>{
	unifiedServer(req, res);
});

httpServer.listen(config.httpPort, ()=>{
	console.log(`The server is started on port ${config.httpPort} in ${config.envname} mode.`);
});

const httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res)=>{
	unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, ()=>{
	console.log(`The server is started on port ${config.httpsPort} in ${config.envname} mode.`);
});

const unifiedServer = (req, res)=>{
	const parsedUrl = url.parse(req.url, true);

	const path = parsedUrl.path;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	const queryStringObject = parsedUrl.query;

	const method = req.method.toUpperCase();

	const headers = req.headers;

	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', (data)=>{
		buffer += decoder.write(data);
	});
	req.on('end', ()=>{
		buffer += decoder.end();

		let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		let data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			buffer
		};

		chosenHandler(data, (statusCode, payload)=>{
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};
			const payloadString = JSON.stringify(payload);
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			console.log('This is the response: ', statusCode, payloadString);
		});
	});
};

let handlers = {};

handlers.notFound = (data, callback)=>{
	callback(404);
};

handlers.hello = (data, callback)=>{
	let msg = {'Hello': 'Welcome to the page'};
	callback(200, msg);
};

const router = {
	'hello': handlers.hello
};