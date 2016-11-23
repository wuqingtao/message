<?php

use PHPUnit\Framework\TestCase;
require_once('../../../server/php/message/mysql_holder.php');
require_once('../../../server/php/message/mysql_post.php');

class MysqlPostTest extends TestCase {
	private $user = 'root';
	private $password = 'Ningning~1';
	private $database = 'test_message';

	const testPosts = [
        ['content'=>'abcdefghijklmnopqrstuvwxyz'],
        ['content'=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
        ['content'=>'1234567890'],
        ['content'=>'红尘世界？一片雾茫茫！'],
        ['content'=>'<p>红尘世界？<em>一片雾茫茫！</em></p>'],
    ];

	public function test_getCount() {
		$holder = new MysqlHolder($this->user, $this->password, $this->database + 'getCount');
		$post = new MysqlPost($holder->inst());
		$holder->inst()->query('TRUNCATE TABLE post');

		$res = $post->getCount();
		$this->assertEquals($res, ['status'=>'ok', 'data'=>['count'=>0]]);
		
		foreach (self::testPosts as $value) {
			$post->add($value);
		}
		
		$res = $post->getCount();
		$this->assertEquals($res, ['status'=>'ok', 'data'=>['count'=>count(self::testPosts)]]);
	
		$holder->destroy();
		$holder->close();
	}
	
	public function test_getAll() {
		$holder = new MysqlHolder($this->user, $this->password, $this->database + 'getAll');
		$post = new MysqlPost($holder->inst());
		$holder->inst()->query('TRUNCATE TABLE post');
		
		$res = $post->getAll();
		$this->assertEquals($res, ['status'=>'ok', 'data'=>[]]);
				
		foreach (self::testPosts as $value) {
			$post->add($value);
		}
		
		$res = $post->getAll();
		$this->assertEquals($res['status'], 'ok');
		$savedTimestamp = PHP_INT_MAX;
		$savedPosts = [];
		foreach ($res['data'] as $value) {
			$id = $value['id'];
			$this->assertTrue(is_integer($id));
			$timestamp = $value['timestamp'];
			$date = date('d', $timestamp);
			$curTimestamp = time();
			$curDate = date('d', $curTimestamp);
			$this->assertEquals($date, $curDate);
			$this->assertGreaterThanOrEqual($timestamp, $curTimestamp);
			$savedTimestamp = $timestamp;
			$savedPosts[] = ['content'=>$value['content']];
		}
		$this->assertEquals($savedPosts, array_reverse(self::testPosts));
	
		$holder->destroy();
		$holder->close();
	}
	
	public function test_getById() {
		$holder = new MysqlHolder($this->user, $this->password, $this->database + 'getById');
		$post = new MysqlPost($holder->inst());
		$holder->inst()->query('TRUNCATE TABLE post');

		$res = $post->getById(['ID'=>1]);
		$this->assertEquals($res['status'], 'lost_parameter');
		
		$res = $post->getById(['id'=>'1234']);
		$this->assertEquals($res['status'], 'invalid_parameter');
						
		foreach (self::testPosts as $value) {
			$post->add($value);
		}

		$res = $post->getAll();
		foreach ($res['data'] as $value) {
			$idres = $post->getById(['id'=>$value['id']]);
			$this->assertEquals($idres, ['status'=>'ok', 'data'=>$value]);
		}
		
		$res = $post->getById(['id'=>PHP_INT_MAX]);
		$this->assertEquals($res['status'], 'none_target');

		$holder->destroy();
		$holder->close();
	}
	
	public function test_add() {
		$holder = new MysqlHolder($this->user, $this->password, $this->database + 'add');
		$post = new MysqlPost($holder->inst());
		$holder->inst()->query('TRUNCATE TABLE post');

		$res = $post->add(['CONTENT'=>'']);
		$this->assertEquals($res['status'], 'lost_parameter');
		
		$res = $post->add(['content'=>1234]);
		$this->assertEquals($res['status'], 'invalid_parameter');
		
		$res = $post->add(['content'=>'']);
		$this->assertEquals($res['status'], 'invalid_parameter');
		
		$res = $post->add(['content'=>'content']);
		$this->assertEquals($res['status'], 'ok');
		$id = $res['data']['id'];
		$this->assertTrue(is_integer($id) && $id > 0);
		$timestamp = $res['data']['timestamp'];
		$this->assertTrue(is_integer($timestamp) && $timestamp > 0);
		$content = $res['data']['content'];
		$this->assertEquals($content, 'content');
	
		$holder->destroy();
		$holder->close();
	}
	
	public function test_modify() {
		$holder = new MysqlHolder($this->user, $this->password, $this->database + 'modify');
		$post = new MysqlPost($holder->inst());
		$holder->inst()->query('TRUNCATE TABLE post');
		
		$res = $post->modify(['ID'=>1]);
		$this->assertEquals($res['status'], 'lost_parameter');
		
		$res = $post->modify(['id'=>'1234']);
		$this->assertEquals($res['status'], 'invalid_parameter');
		
		$res = $post->modify(['id'=>1234]);
		$this->assertEquals($res['status'], 'lost_parameter');
		
		$res = $post->modify(['id'=>1234, 'content'=>'content']);
		$this->assertEquals($res['status'], 'none_target');
		
		$post->add(['content'=>'content']);
		$res = $post->getAll();
		$preData = $res['data'][0];
		$res = $post->modify(['id'=>$preData['id'], 'content'=>'CONTENT']);
		$this->assertEquals($res['status'], 'ok');
		$modifiedData = $res['data'];
		$res = $post->getAll();
		$nowData = $res['data'][0];
		$this->assertEquals($preData['id'], $modifiedData['id']);
		$this->assertEquals($preData['timestamp'], $modifiedData['timestamp']);
		$this->assertEquals($modifiedData['content'], 'CONTENT');
		$this->assertEquals($modifiedData, $nowData);

		$holder->destroy();
		$holder->close();
	}
	
	public function test_remove() {
		$holder = new MysqlHolder($this->user, $this->password, $this->database + 'remove');
		$post = new MysqlPost($holder->inst());
		$holder->inst()->query('TRUNCATE TABLE post');

		$res = $post->remove(['ID'=>1]);
		$this->assertEquals($res['status'], 'lost_parameter');
		
		$res = $post->remove(['id'=>'1234']);
		$this->assertEquals($res['status'], 'invalid_parameter');
		
		$res = $post->remove(['id'=>1234]);
		$this->assertEquals($res['status'], 'none_target');
		
		$post->add(['content'=>'content']);
		$res = $post->getAll();
		$data = $res['data'][0];
		$res = $post->remove(['id'=>$data['id']]);
		$this->assertEquals($res, ['status'=>'ok', 'data'=>['id'=>$data['id']]]);

		$holder->destroy();
		$holder->close();
	}
}

?>
