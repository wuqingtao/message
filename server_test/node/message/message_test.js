#!/usr/bin/env node

'use strict';

var assert = require('assert');
var message = require('../../../server/node/message/message.js');

function TestHolder() {
}

TestHolder.prototype.inst = function() {
}

TestHolder.prototype.close = function(callback) {
	callback(undefined);
}

TestHolder.prototype.destroy = function(callback) {
	callback(undefined);
}

function TestPost() {
}

TestPost.prototype.getCount = function(callback) {
	callback(undefined, {status:'ok', data:{'count':1234}});
}

TestPost.prototype.getAll = function(callback) {
	callback(undefined, {status:'ok', data:[{id:1234, timestamp:123456, content:'abcd'}, {id:12345, timestamp:1234567, content:'abcde'}]});
}

TestPost.prototype.getById = function(data, callback) {
	callback(undefined, {status:'ok', data:{id:1234, timestamp:123456, content:'abcd'}});
}

TestPost.prototype.add = function(data, callback) {
	callback(undefined, {status:'ok', data:{id:1234, timestamp:123456, content:'abcd'}});
}

TestPost.prototype.modify = function(data, callback) {
	callback(undefined, {status:'ok', data:{id:1234, timestamp:123456, content:'abcd'}});
}

TestPost.prototype.remove = function(data, callback) {
	callback(undefined, {status:'ok', data:{id:1234}});
}

describe('Message()', function() {
	it('test', function(done) {
		this.timeout(0);

        const holder = new TestHolder();
        const post = new TestPost();
		const msg = new message.Message(holder, post);
		
		msg.request({}, function(err, res) {
			assert.equal(res.status, 'lost_parameter');
		});
		
		msg.request({type:'abcd'}, function(err, res) {
			assert.equal(res.status, 'invalid_parameter');
		});

        msg.request({type:'get_post_count'}, function(err, res) {
			post.getCount(function callback(gerr, gres) {
				assert.deepEqual(gres, gres);
			});
		});

        msg.request({type:'get_all_post'}, function(err, res) {
			post.getAll(function callback(gerr, gres) {
				assert.deepEqual(gres, res);
			});
		});

        msg.request({type:'get_post_by_id'}, function(err, res) {
			post.getById({}, function callback(gerr, gres) {
				assert.deepEqual(gres, res);
			});
		});

        msg.request({type:'add_post'}, function(err, res) {
			post.add({}, function callback(gerr, gres) {
				assert.deepEqual(gres, res);
			});
		});

        msg.request({type:'modify_post'}, function(err, res) {
			post.modify({}, function callback(gerr, gres) {
				assert.deepEqual(gres, res);
			});
		});

        msg.request({type:'remove_post'}, function(err, res) {
			post.remove({}, function callback(gerr, gres) {
				assert.deepEqual(gres, res);
			});
		});

        msg.close(function(err) {
			assert.equal(err, undefined);
			done();
		});
	});
});
