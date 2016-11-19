#!/usr/bin/env node

'use strict';

var assert = require('assert');
var mysql_holder = require('../../../server/node/message/mysql_holder.js');
var mysql_post = require('../../../server/node/message/mysql_post.js');

var user = 'root';
var password = 'Ningning~1';
var database = 'test_message';

describe('MysqlPostTest()', function() {
	const testPosts = [
        {'content':'abcdefghijklmnopqrstuvwxyz'},
        {'content':'ABCDEFGHIJKLMNOPQRSTUVWXYZ'},
        {'content':'1234567890'},
        {'content':'红尘世界？一片雾茫茫！'},
        {'content':'<p>红尘世界？<em>一片雾茫茫！</em></p>'},
    ];

	it('test getCount()', function(done) {
		this.timeout(0);
		
		let holder = new mysql_holder.MysqlHolder(user, password, database + 'getCount');
		let post = new mysql_post.MysqlPost(holder.inst());

		post.getCount(function(err, res) {
			assert.deepEqual(res, {status:'ok', data:{'count':0}});
		});
		
		for (let i in testPosts) {
			post.add(testPosts[i]);
		}
		
		post.getCount(function(err, res) {
			assert.deepEqual(res, {status:'ok', data:{'count':testPosts.length}});
		
			holder.destroy();
			holder.close(function(err) {
				done();
			});
		});
	});
	
	it('test getAll()', function(done) {
		this.timeout(0);
		
		let holder = new mysql_holder.MysqlHolder(user, password, database + 'getAll');
		let post = new mysql_post.MysqlPost(holder.inst());
		
		post.getAll(function(err, res) {
			assert.deepEqual(res, {'status':'ok', 'data':[]});
		});
				
		for (let i in testPosts) {
			post.add(testPosts[i]);
		}
		
		post.getAll(function(err, res) {
			assert.equal(res.status, 'ok');
			
			let savedTimestamp = Number.MAX_SAFE_INTEGER;
			let savedPosts = [];
			for (let i in res.data) {
				let id = res.data[i].id;
				assert.equal(typeof id, 'number');
				let timestamp = res.data[i].timestamp;
				let date = new Date(timestamp * 1000);
				let curDate = new Date();
				let curTimestamp = Math.floor(curDate.getTime() / 1000);
				assert.equal(date.getDate(), curDate.getDate());
				assert(timestamp <= curTimestamp);
				savedTimestamp = timestamp;
				savedPosts.push({content:res.data[i].content});
			}
			assert.deepEqual(savedPosts, testPosts.reverse());
		
			holder.destroy();
			holder.close(function(err) {
				done();
			});
		});
	});
	
	it('test getById()', function(done) {
		this.timeout(0);
		
		let holder = new mysql_holder.MysqlHolder(user, password, database + 'getById');
		let post = new mysql_post.MysqlPost(holder.inst());
		
		post.getById({ID:1}, function(err, res) {
			assert.equal(res.status, 'lost_parameter');
		});
		
		post.getById({id:'1234'}, function(err, res) {
			assert.equal(res.status, 'invalid_parameter');
		});
						
		for (let i in testPosts) {
			post.add(testPosts[i]);
		}

		post.getAll(function(err, res) {
			for (let i in res.data) {
				let data = res.data[i];
				post.getById({id:data.id}, function(ierr, ires) {
					assert.deepEqual(ires, {status:'ok', data:data});
				});
			}
		});
		
		post.getById({id:Number.MAX_SAFE_INTEGER}, function(err, res) {
			assert.equal(res.status, 'none_target');
		
			holder.destroy();
			holder.close(function(err) {
				done();
			});
		});
	});
	
	it('test add()', function(done) {
		this.timeout(0);
		
		let holder = new mysql_holder.MysqlHolder(user, password, database + 'add');
		let post = new mysql_post.MysqlPost(holder.inst());
		
		post.add({CONTENT:''}, function(err, res) {
			assert.equal(res.status, 'lost_parameter');
		});
		
		post.add({content:1234}, function(err, res) {
			assert.equal(res.status, 'invalid_parameter');
		});
		
		post.add({content:''}, function(err, res) {
			assert.equal(res.status, 'invalid_parameter');
		});
		
		post.add({content:'content'}, function(err, res) {
			assert.equal(res.status, 'ok');
			
			let id = res.data.id;
			assert(typeof id == 'number' && id > 0);

			let timestamp = res.data.timestamp;
			assert(typeof timestamp == 'number' && timestamp > 0);
			
			let content = res.data.content;
			assert.equal(content, 'content');
		
			holder.destroy();
			holder.close(function(err) {
				done();
			});
		});
	});
	
	it('test modify()', function(done) {
		this.timeout(0);
		
		let holder = new mysql_holder.MysqlHolder(user, password, database + 'modify');
		let post = new mysql_post.MysqlPost(holder.inst());
		
		post.modify({ID:1}, function(err, res) {
			assert.equal(res.status, 'lost_parameter');
		});
		
		post.modify({id:'1234'}, function(err, res) {
			assert.equal(res.status, 'invalid_parameter');
		});
		
		post.modify({id:1234}, function(err, res) {
			assert.equal(res.status, 'lost_parameter');
		});
		
		post.modify({id:1234, content:'content'}, function(err, res) {
			assert.equal(res.status, 'none_target');
		});
		
		post.add({content:'content'}, function() {
			post.getAll(function(err, res) {
				let preData = res.data[0]
				
				post.modify({id:preData.id, content:'CONTENT'}, function(merr, mres) {
					assert.equal(mres.status, 'ok');
					
					let modifiedData = mres.data;
					
					post.getAll(function(aerr, ares) {
						let nowData = ares.data[0];
						
						assert.equal(preData.id, modifiedData.id);
						assert.equal(preData.timestamp, modifiedData.timestamp);
						assert.equal(modifiedData.content, 'CONTENT');
						assert.deepEqual(modifiedData, nowData);
						
						holder.destroy();
						holder.close(function(err) {
							done();
						});
					});
				});
			});			
		});
	});
	
	it('test remove()', function(done) {
		this.timeout(0);
		
		let holder = new mysql_holder.MysqlHolder(user, password, database + 'remove');
		let post = new mysql_post.MysqlPost(holder.inst());

		post.remove({ID:1}, function(err, res) {
			assert.equal(res.status, 'lost_parameter');
		});
		
		post.remove({id:'1234'}, function(err, res) {
			assert.equal(res.status, 'invalid_parameter');
		});
		
		post.remove({id:1234}, function(err, res) {
			assert.equal(res.status, 'none_target');
		});
		
		post.add({content:'content'}, function() {
			post.getAll(function(err, res) {
				let data = res.data[0];
				
				post.remove({id:data.id}, function(rerr, rres) {
					assert.deepEqual(rres, {status:'ok', data:{id:data.id}});
					
					holder.destroy();
					holder.close(function(err) {
						done();
					});
				});
			});
		});
	});
});
