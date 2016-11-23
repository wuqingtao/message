<?php

require_once('mysql_holder.php');
require_once('mysql_post.php');
require_once('message.php');

function createByMysql($user, $password) {
	$holder = new MysqlHolder($user, $password);
    $post = new MysqlPost($holder->inst());
    return new Message($holder, $post);
}

?>
