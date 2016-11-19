#!/usr/bin/env node

'use strict';

// 引入模块
var assert = require('assert');
var checker = require('../../../server/node/message/checker.js');

describe('checkParamType()', function() {
	it('字段校验', function() {
		assert.deepEqual(checker.checkParamType(null), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
		assert.deepEqual(checker.checkParamType(undefined), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
		assert.deepEqual(checker.checkParamType(1), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
		assert.deepEqual(checker.checkParamType(''), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
		assert.deepEqual(checker.checkParamType([]), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
		assert.deepEqual(checker.checkParamType({}), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
        assert.deepEqual(checker.checkParamType({abcd:'1234'}), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
        assert.deepEqual(checker.checkParamType({Type:'1234'}), [undefined, {status:'lost_parameter', message:'"type" is necessary.'}]);
	});
	
	it('值校验', function() {
        assert.deepEqual(checker.checkParamType({type:1234}), [undefined, {status:'invalid_parameter', message:'"type" should be string and not null.'}]);
        assert.deepEqual(checker.checkParamType({type:''}), [undefined, {status:'invalid_parameter', message:'"type" should be string and not null.'}]);
        assert.deepEqual(checker.checkParamType({type:'1234'}), ['1234', undefined]);
	});
});

describe('test_checkParamId()', function() {
	it('字段校验', function() {
		assert.deepEqual(checker.checkParamId({}), [undefined, {status:'lost_parameter', message:'"id" is necessary.'}]);
		assert.deepEqual(checker.checkParamId({abcd:1234}), [undefined, {status:'lost_parameter', message:'"id" is necessary.'}]);
		assert.deepEqual(checker.checkParamId({Id:1234}), [undefined, {status:'lost_parameter', message:'"id" is necessary.'}]);
	});
	it('值校验', function() {
		assert.deepEqual(checker.checkParamId({id:'1234'}), [undefined, {status:'invalid_parameter', message:'"id" should be int.'}]);
		assert.deepEqual(checker.checkParamId({id:1234}), [1234, undefined]);
	});
});

describe('test_checkParamContent()', function() {
	it('字段校验', function() {
		assert.deepEqual(checker.checkParamContent({}), [undefined, {status:'lost_parameter', message:'"content" is necessary.'}]);
		assert.deepEqual(checker.checkParamContent({abcd:'1234'}), [undefined, {status:'lost_parameter', message:'"content" is necessary.'}]);
		assert.deepEqual(checker.checkParamContent({Content:'1234'}), [undefined, {status:'lost_parameter', message:'"content" is necessary.'}]);
	});
	
	it('值校验', function() {
		assert.deepEqual(checker.checkParamContent({content:1234}), [undefined, {status:'invalid_parameter', message:'"content" should be string and not null.'}]);
		assert.deepEqual(checker.checkParamContent({content:''}), [undefined, {status:'invalid_parameter', message:'"content" should be string and not null.'}]);
		assert.deepEqual(checker.checkParamContent({content:'1234'}), ['1234', undefined]);
	});
});
