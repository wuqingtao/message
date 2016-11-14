'use strict';

// 导出模块
module.exports.formatDate = formatDate;

/**
 * 格式化日期
 * 例如：2016/11/14 11:07:45
 * @param {Date} date 日期
 * @return {string} 格式化后的日期字符串
 */
function formatDate(date) {
	if (!date || date.constructor != Date) {
		return '';
	}
	
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
