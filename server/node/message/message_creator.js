#!/usr/bin/env node

'use strict';

exports.createByMysql = createByMysql;

var mysql_holder = require('./mysql_holder');
var mysql_post = require('./mysql_post');
var message = require('./message');

function createByMysql(user, password) {
    const holder = new mysql_holder.MysqlHolder(user, password);
    const post = new mysql_post.MysqlPost(holder.inst());
    return new message.Message(holder, post);
}
