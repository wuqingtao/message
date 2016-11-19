#!/usr/bin/env node

'use strict';

exports.MysqlPost = MysqlPost;

var checker = require('./checker');

function MysqlPost(conn, table) {
	this.conn = conn;
	this.table = table ? table : 'post';

	this.conn.query('CREATE TABLE IF NOT EXISTS ?? (`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT, `timestamp` INT NOT NULL, `content` TEXT NOT NULL)', [this.table], function(err) {
		if (err) {
			console.error('create table err: ' + err.stack);
		}
	});
}

MysqlPost.prototype.getCount = function(callback) {
	this.conn.query('SELECT COUNT(`id`) AS count FROM ??', [this.table], function(err, results) {
		if (err) {
			console.error('select count err: ' + err.stack);
		}
		if (callback) {
			if (err) {
				callback(err);
			} else {
				let res = {status:'ok', data:results[0]};
				callback(undefined, res);
			}
		}
	});
}

MysqlPost.prototype.getAll = function(callback) {
	this.conn.query('SELECT `id`, `timestamp`, `content` FROM ?? ORDER BY `id` DESC', [this.table], function(err, results) {
		if (err) {
			console.error('select * err: ' + err.stack);
		}
		if (callback) {
			if (err) {
				callback(err);
			} else {
				let data = [];
				for (let i in results) {
					data.push(results[i]);
				}
				let res = {status:'ok', data:data};
				callback(undefined, res);
			}
		}
	});
}

MysqlPost.prototype.getById = function(data, callback) {
	let [id, idErr] = checker.checkParamId(data);
	if (idErr) {
		if (callback) {
			callback(undefined, idErr);
		}
		return;
	}

	this.conn.query('SELECT `id`, `timestamp`, `content` FROM ?? WHERE `id`=? LIMIT 1', [this.table, id], function(err, results) {
		if (err) {
			console.error('select * err: ' + err.stack);
		}
		if (callback) {
			if (err) {
				callback(err);
			} else {
				let res = results.length != 0 ? {status:'ok', data:results[0]} : {status:'none_target', message:'"id" does not exist.'};
				callback(undefined, res);
			}
		}
	});
}

MysqlPost.prototype.add = function(data, callback) {
	let [content, contentErr] = checker.checkParamContent(data);
	if (contentErr) {
		if (callback) {
			callback(undefined, contentErr);
		}
		return;
	}

	let timestamp = Math.floor(new Date().getTime() / 1000);
	this.conn.query('INSERT INTO ?? SET `timestamp`=?, `content`=?', [this.table, timestamp, content], function(err, result) {
		if (err) {
			console.error('select * err: ' + err.stack);
		}
		if (callback) {
			if (err) {
				callback(err);
			} else {
				let res = {'status':"ok", 'data':{'id':result.insertId, 'timestamp':timestamp, 'content':content}}
				callback(undefined, res);
			}
		}
	});
}

MysqlPost.prototype.modify = function(data, callback) {
	let _this = this;
	
	let [id, idErr] = checker.checkParamId(data);
	if (idErr) {
		if (callback) {
			callback(undefined, idErr);
		}
		return;
	}
	
	let [content, contentErr] = checker.checkParamContent(data);
	if (contentErr) {
		if (callback) {
			callback(undefined, contentErr);
		}
		return;
	}

	this.conn.query('UPDATE ?? SET `content`=? WHERE `id`=?', [this.table, content, id], function(err, result) {
		if (err) {
			console.error('select * err: ' + err.stack);
		}
		if (callback) {
			if (err) {
				callback(err);
			} else {
				if (result.affectedRows == 1) {
					_this.getById({id:id}, function(ierr, ires) {
						callback(ierr, ires)
					});
				} else {
					let res = {status:'none_target', message:'"id" does not exist.'};
					callback(undefined, res);
				}
			}
		}
	});
}

MysqlPost.prototype.remove = function(data, callback) {
	let [id, idErr] = checker.checkParamId(data);
	if (idErr) {
		if (callback) {
			callback(undefined, idErr);
		}
		return;
	}

	this.conn.query('DELETE FROM ?? WHERE `id`=?', [this.table, id], function(err, result) {
		if (err) {
			console.error('remove err: ' + err.stack);
		}
		if (callback) {
			if (err) {
				callback(err);
			} else {
				let res = result.affectedRows == 1 ? {status:'ok', data:{id:id}} : {status:'none_target', message:'"id" does not exist.'};
				callback(undefined, res);
			}
		}
	});
}
