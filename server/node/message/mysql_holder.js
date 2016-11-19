#!/usr/bin/env node

'use strict';

exports.MysqlHolder = MysqlHolder;

var mysql = require('mysql');

function MysqlHolder(user, password, database) {
	this.conn = mysql.createConnection({user:user, password:password});
	this.database = database ? database : 'message';
	
	this.conn.connect(function(err) {
		if (err) {
			console.error('connect err: ' + err.stack);
		}
	});

	this.conn.query('CREATE DATABASE IF NOT EXISTS ?? DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci', [this.database], function(err) {
		if (err) {
			console.error('create database err: ' + err.stack);
		}
	});

	this.conn.query('USE ??', [this.database], function(err) {
		if (err) {
			console.error('use database err: ' + err.stack);
		}
	});
}

MysqlHolder.prototype.inst = function() {
	return this.conn;
}

MysqlHolder.prototype.close = function(callback) {
	this.conn.end(function(err) {
		if (err) {
			console.error('close connection err: ' + err.stack);
		}
		if (callback) {
			callback(err);
		}
	});
}

MysqlHolder.prototype.destroy = function(callback) {
	this.conn.query('DROP DATABASE IF EXISTS ??', [this.database], function(err) {
		if (err) {
			console.error('drop database err: ' + err.stack);
		}
		if (callback) {
			callback(err);
		}
	});
}
