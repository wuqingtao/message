'use strict';

// 引入模块
var assert = require('assert');
var util = require('../../html/js/util.js');

// 测试formatDate函数
describe('formatDate()', function() {
	it('合法Date测试', function() {
		var date = new Date();
		date.setFullYear(2020);
		date.setMonth(11);
		date.setDate(31);
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(58);
		assert.equal(util.formatDate(date), '2020/12/31 23:59:58');
	});
	
	it('合法Date测试 - 是否正确的填充了0', function() {
		var date = new Date();
		date.setFullYear(2020);
		date.setMonth(1);
		date.setDate(1);
		date.setHours(3);
		date.setMinutes(9);
		date.setSeconds(8);
		assert.equal(util.formatDate(date), '2020/02/01 03:09:08');
	});
	
	it('非法Date测试 - 非Date类型', function() {
		assert.equal(util.formatDate('abcd'), '');
		assert.equal(util.formatDate(1234), '');
		assert.equal(util.formatDate(undefined), '');
	});
});
