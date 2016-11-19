#!/usr/bin/env node

'use strict';

var assert = require('assert');
var mysql_holder = require('../../../server/node/message/mysql_holder.js');

var user = 'root';
var password = 'Ningning~1';
var database = 'test_message';

describe('MysqlHolder()', function() {
	it('test', function(done) {
		this.timeout(0);

        const holder = new mysql_holder.MysqlHolder(user, password, database);
        
        const conn = holder.inst()

        conn.query('SHOW TABLES', function(err) {
			assert(!err);
		});

		holder.destroy(function(err) {
			assert(!err);
		});

        conn.query('SHOW TABLES', function(err) {
			assert(err);
		});

		holder.close(function(err) {
			assert(!err);
			done();
		});

        conn.query('SHOW TABLES', function(err) {
			assert(err);
		});
	});
});
