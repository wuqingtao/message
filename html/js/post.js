'use strict';

// 导出模块
module.exports.getAllPost = getAllPost;
module.exports.addPost = addPost;
module.exports.removePost = removePost;

// 引入模块
var util = require('./util.js');

/**
 * 获取所有的POST
 * @param {function} successCallback function(id, timestamp, content) 成功获取一个POST后回调函数
 * @param {function} errorCallback function(Error) 获取失败回调函数
 */
function getAllPost(successCallback, errorCallback) {
	$.ajax({
		type: 'POST',
		url: '/request_message',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify({'type': 'get_all_post'}),
		success: function(result) {
			if (result.status == 'ok') {
				var postHtml = '';
				for (var i in result.data) {
					var post = result.data[i];
					var id = post.id;
					var timestamp = util.formatDate(new Date(post.timestamp * 1000));
					var content = post.content;
					successCallback(id, timestamp, content);
				}
			} else {
				errorCallback(new Error('`get_all_post` failed: ' + result.status_message));
			}
		},
		error: function(error) {
			errorCallback(new Error('`get_all_post` error.status: ' + error.status));
		}
	});
}

/**
 * 添加单个的POST
 * @param {string} content POST内容
 * @param {function} successCallback function(id, timestamp, content) 添加成功回调函数
 * @param {function} errorCallback function(Error) 添加失败回调函数
 */
function addPost(content, successCallback, errorCallback) {
	$.ajax({
		type: 'POST',
		url: '/request_message',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify({'type': 'add_post', 'content':content}),
		success: function(result) {
			if (result.status == 'ok') {
				var post = result.data;
				var id = post.id;
				var timestamp = util.formatDate(new Date(post.timestamp * 1000));
				var content = post.content;
				successCallback(id, timestamp, content);
			} else {
				errorCallback(new Error('`add_post` failed: ' + result.status_message));
			}
		},
		error: function(error) {
			errorCallback(new Error('`add_post` error.status: ' + error.status));
		}
	});
}

/**
 * 根据ID删除POST
 * @param {number} id POST ID
 * @param {function} successCallback 删除成功回调函数
 * @param {function} errorCallback function(Error) 删除失败回调函数
 */
function removePost(id, successCallback, errorCallback) {
	$.ajax({
		type: 'POST',
		url: '/request_message',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify({'type': 'remove_post', 'id':id}),
		success: function(result) {
			if (result.status == 'ok') {
				successCallback();
			} else {
				errorCallback( new Error('`remove_post` failed: ' + result.status_message));
			}
		},
		error: function(error) {
			errorCallback(new Error('`remove_post` error.status: ' + error.status));
		}
	});
}
