<?php

use PHPUnit\Framework\TestCase;
require_once('../../../server/php/message/mysql_holder.php');

class MysqlHolderTest extends TestCase {
	private $user = 'root';
	private $password = 'Ningning~1';
	private $database = 'test_message';

	public function test() {
        $holder = new MysqlHolder($this->user, $this->password, $this->database);
        
        $conn = $holder->inst();

        $res = $conn->query('SHOW TABLES');
		$this->assertNotEmpty($res);

		$holder->destroy();

        $res = $conn->query('SHOW TABLES');
		$this->assertFalse($res);

		$holder->close();

		try {
			$conn->query('SHOW TABLES');
		} catch(Exception $e) {
			$this->assertTrue(true);
		}
	}
}

?>
