'use strict';

// 简单模拟CommonJS，用于浏览器运行

var module = {
	exports: {}
};

var exports = module.exports;

function require() {
	return module.exports;
}
