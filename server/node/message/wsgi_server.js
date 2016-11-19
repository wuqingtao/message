#!/usr/bin/env node

'use strict';

var log4js = require('log4js');

log4js.configure({
	appenders: [
		{type:'console'},
		{type:'file', filename:'server.log', category:'server', maxLogSize:20480}
	]
});

var logger = log4js.getLogger('server');

var fcgi = require('node-fastcgi');
var message_creator = require('./message_creator');

var user = 'root';
var password = 'Ningning~1';

fcgi.createServer(function(req, res) {
	if (req.method === 'POST') {
		var body = "";

		req.on('data', function(data) {
			body += data.toString();
		});
		
		req.on('end', function() {
			let param = JSON.parse(body);

			let message = message_creator.createByMysql(user, password);
			message.request(param, function(merr, mres) {
				logger.info('req:' + JSON.stringify(param) + ' ' + 'err:' + JSON.stringify(merr) + ' ' + 'res:' + JSON.stringify(mres));
				if (merr) {
					res.writeHead(500);
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'text/plain;charset=UTF-8' });
					res.end(JSON.stringify(mres));
				}
			});
		});
		
	} else {
		res.writeHead(501);
		res.end();
	}
}).listen();
