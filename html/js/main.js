'use strict';

// 引入模块
var post = require('./post.js');

// 获取所有的POST
post.getAllPost(
	function(id, timestamp, content) {
		addMessage(id, timestamp, content, false);
	},
	function(error) {
		alert(error);
	}
);

// 注册按钮事件
$(document).ready(function() {
	$("#send_message").click(function() {
		var content = $("#message_content").val();
		post.addPost(
			content,
			function(id, timestamp, content) {
				addMessage(id, timestamp, content, true);
			},
			function(error) {
				alert(error);
			}
		);
	});
	
	$("#message_list").on("click", ".message_remove", function() {
		var id = parseInt($(this).attr("id").replace("message_", ""));
		var message = $(this).parent();
		post.removePost(
			id,
			function() {
				removeMessage(message);
			},
			function(error) {
				alert(error);
			}
		);
	});
});

/**
 * 添加MESSAGE到#message_list
 * @param id ID
 * @param timestamp 时间戳
 * @param content 内容
 * @param reverse 是否该插入到第一项
 */
function addMessage(id, timestamp, content, reverse) {
	var message =
		"<div>" +
			"<br>" +
			"<p>" + content + "</p>" +
			"<p class=\"text-muted\">" + timestamp + "</p>" +
			"<button id=\"message_" + id + "\" type=\"button\" class=\"btn btn-link btn-xs message_remove\">删除</button>" +
		"</div>";
	if (reverse) {
		$("#message_list").prepend(message);
	} else {
		$("#message_list").append(message);
	}
}

/**
 * 删除MESSAGE
 * @param MESSAGE DIV
 */
function removeMessage(message) {
	message.remove();
}
