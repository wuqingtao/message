<?php

use PHPUnit\Framework\TestCase;
require_once('../../../server/php/message/message.php');

class TestHolder {
	public function destroy() {
	}
	
	public function close() {
	}
}

class TestPost {
	public function getCount() {
		return ['status'=>'ok', 'data'=>['count'=>1234]];
	}

	public function getAll() {
		return ['status'=>'ok', 'data'=>[['id'=>1234, 'timestamp'=>123456, 'content'=>'abcd'], ['id'=>12345, 'timestamp'=>1234567, 'content'=>'abcde']]];
	}

	public function getById($data) {
		return ['status'=>'ok', 'data'=>['id'=>1234, 'timestamp'=>123456, 'content'=>'abcd']];
	}

	public function add($data) {
		return ['status'=>'ok', 'data'=>['id'=>1234, 'timestamp'=>123456, 'content'=>'abcd']];
	}

	public function modify($data) {
		return ['status'=>'ok', 'data'=>['id'=>1234, 'timestamp'=>123456, 'content'=>'abcd']];
	}

	public function remove($data) {
		return ['status'=>'ok', 'data'=>['id'=>1234]];
	}
}

class MessageTest extends TestCase {
	public function test() {
        $holder = new TestHolder();
        $post = new TestPost();
		$message = new Message($holder, $post);
		
		$res = $message->request([]);
		$this->assertEquals($res['status'], 'lost_parameter');
		
		$res = $message->request(['type'=>'abcd']);
		$this->assertEquals($res['status'], 'invalid_parameter');

        $res = $message->request(['type'=>'get_post_count']);
		$this->assertEquals($res, $post->getCount());

        $res = $message->request(['type'=>'get_all_post']);
		$this->assertEquals($res, $post->getAll());

        $res = $message->request(['type'=>'get_post_by_id']);
		$this->assertEquals($res, $post->getById([]));

        $res = $message->request(['type'=>'add_post']);
		$this->assertEquals($res, $post->add([]));

        $message->request(['type'=>'modify_post']);
		$this->assertEquals($res, $post->modify([]));

        $res = $message->request(['type'=>'remove_post']);
		$this->assertEquals($res, $post->remove([]));

        $res = $message->close();
		$this->assertNull($res);
	}
}

?>
