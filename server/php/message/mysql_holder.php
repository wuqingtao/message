<?php

class MysqlHolder {
	private $conn;
	private $database;
	
	public function __construct($user, $password, $database = 'message') {
		$this->conn = new mysqli('localhost', $user, $password);
		$this->database = $database;
		
		$this->conn->query(sprintf('CREATE DATABASE IF NOT EXISTS `%s` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci', $this->database));
		$this->conn->query(sprintf('USE `%s`', $this->database));
	}
	
	public function inst() {
		return $this->conn;
	}
	
	public function destroy() {
		$this->conn->query(sprintf('DROP DATABASE IF EXISTS `%s`', $this->database));
	}
	
	public function close() {
		$this->conn->close();
	}
}

?>
