#!/usr/bin/env node

'use strict';

exports.Message = Message;

var checker = require('./checker');

function Message(holder, post) {
	this.holder = holder;
	this.post = post;
}

Message.prototype.request = function(data, callback) {
	let [type, typeErr] = checker.checkParamType(data);
	if (typeErr) {
		if (callback) {
			callback(undefined, typeErr);
		}
		return;
	}
	
	if (type == 'get_post_count') {
		this.post.getCount(callback);
	} else 	if (type == 'get_all_post') {
		this.post.getAll(callback);
	} else 	if (type == 'get_post_by_id') {
		this.post.getById(data, callback);
	} else 	if (type == 'add_post') {
		this.post.add(data, callback);
	} else 	if (type == 'modify_post') {
		this.post.modify(data, callback);
	} else 	if (type == 'remove_post') {
		this.post.remove(data, callback);
	} else {
		if (callback) {
			callback(undefined, {status:'invalid_parameter', message:'"type" is invalid.'});
		}
	}
}

Message.prototype.close = function(callback) {
	this.holder.close(callback);
}
