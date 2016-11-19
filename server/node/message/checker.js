#!/usr/bin/env node

'use strict';

// 导出模块
exports.checkParamType = checkParamType;
exports.checkParamId = checkParamId;
exports.checkParamContent = checkParamContent;

/**
 * 检查`type`参数是否合法
 * @param {*} data 参数坐在的对象
 * @return {[string, *]} 如果检查通过，返回对应的值，否则返回错误信息
 */
function checkParamType(data) {
	try {
		if (!('type' in data)) {
			return [undefined, {status:'lost_parameter', message:'"type" is necessary.'}];
		}
	} catch(e) {
		return [undefined, {status:'lost_parameter', message:'"type" is necessary.'}];
	}
	let type = data.type;
	if (typeof type != 'string' || !type) {
		return [undefined, {status:'invalid_parameter', message:'"type" should be string and not null.'}];
	}
	return [type, undefined];
}

/**
 * 检查`id`参数是否合法
 * @param {*} data 参数坐在的对象
 * @return {[number, *]} 如果检查通过，返回对应的值，否则返回错误信息
 */
function checkParamId(data) {
	if (!('id' in data)) {
		return [undefined, {status:'lost_parameter', message:'"id" is necessary.'}];
	}
	let id = data.id;
	if (typeof id != 'number') {
		return [undefined, {status:'invalid_parameter', message:'"id" should be int.'}];
	}
	return [id, undefined];
}

/**
 * 检查`content`参数是否合法
 * @param {*} data 参数坐在的对象
 * @return {[string, *]} 如果检查通过，返回对应的值，否则返回错误信息
 */
function checkParamContent(data) {
    if (!('content' in data)) {
        return [undefined, {status:'lost_parameter', message:'"content" is necessary.'}];
	}
    let content = data.content;
    if (typeof content != 'string' || !content) {
        return [undefined, {status:'invalid_parameter', message:'"content" should be string and not null.'}];
	}
    return [content, undefined];
}
