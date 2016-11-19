#!/usr/bin/env node

'use strict';

var commander = require('commander');
commander
	.option('-u --user [value]', 'Mysql user')
	.option('-u --password [value]', 'Mysql password')
	.parse(process.argv);
var user = commander.user;
var password = commander.password;

var path = require('path');
var logPath = path.resolve(__dirname, '../../../server_logs/node/');
var logParentPath = path.resolve(logPath, '../');
var logFile = path.resolve(logPath, 'server.log');
var fs = require('fs');
if (!fs.existsSync(logParentPath)) {
	fs.mkdirSync(logParentPath);
}
if (!fs.existsSync(logPath)) {
	fs.mkdirSync(logPath);
}

var log4js = require('log4js');
log4js.configure({
	appenders: [
		{type:'console'},
		{type:'file', absolute:true, filename:logFile, category:'server', maxLogSize:8*1024*1024},
	]
});
var logger = log4js.getLogger('server');

var fcgi = require('node-fastcgi');
var message_creator = require('./message_creator');

fcgi.createServer(function(req, res) {
	if (req.method == 'POST') {
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
