
getAllPost();

$(document).ready(function() {
	$("#send_message").click(function() {
		var content = $("#message_content").val();
		addPost(content);
	});
	
	$("#message_list").on("click", ".message_remove", function() {
		var id = parseInt($(this).attr("id").replace("message_", ""));
		removePost(id, $(this).parent());
	});
});

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

function removeMessage(message) {
	message.remove();
}

function getAllPost() {
	$.ajax({
		type: "POST",
		url: "/request_message",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({"type": "get_all_post"}),
		success: function(result) {
			if (result.status == "ok") {
				var postHtml = "";
				for (var i in result.data) {
					var post = result.data[i];
					var id = post.id;
					var timestamp = formatDate(new Date(post.timestamp * 1000));
					var content = post.content;
					addMessage(id, timestamp, content, false);
				}
			} else {
				alert("`get_all_post` failed: " + result.status_message);
			}
		},
		error: function(error) {
			alert("`get_all_post` error.status: " + error.status);
		}
	});
}

function addPost(content) {
	$.ajax({
		type: "POST",
		url: "/request_message",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({"type": "add_post", "content":content}),
		success: function(result) {
			if (result.status == "ok") {
				var post = result.data;
				var id = post.id;
				var timestamp = formatDate(new Date(post.timestamp * 1000));
				var content = post.content;
				addMessage(id, timestamp, content, true);
			} else {
				alert("`add_post` failed: " + result.status_message);
			}
		},
		error: function(error) {
			alert("`add_post` error.status: " + error.status);
		}
	});
}

function removePost(id, message) {
	$.ajax({
		type: "POST",
		url: "/request_message",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify({"type": "remove_post", "id":id}),
		success: function(result) {
			if (result.status == "ok") {
				removeMessage(message);
			} else {
				alert("`remove_post` failed: " + result.status_message);
			}
		},
		error: function(error) {
			alert("`remove_post` error.status: " + error.status);
		}
	});
}

function formatDate(date) {  
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;
    var day = date.getDate();
    day = day < 10 ? ('0' + day) : day;
    var hour = date.getHours();
	hour = hour < 10 ? ('0' + hour) : hour;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
}
