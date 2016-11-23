<?php

require_once('checker.php');

class MysqlPost {
	private $conn;
	private $table;
	
	public function __construct($conn, $table = 'post') {
		$this->conn = $conn;
		$this->table = $table;
		$this->conn->query(sprintf('CREATE TABLE IF NOT EXISTS `%s` (`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT, `timestamp` INT NOT NULL, `content` TEXT NOT NULL)', $this->table));
	}

	public function getCount() {
		$res = $this->conn->query(sprintf('SELECT COUNT(`id`) AS count FROM `%s`', $this->table));
		$row = $res->fetch_assoc();
		$row['count'] = (int)$row['count'];
		return ['status'=>'ok', 'data'=>$row];
	}

	public function getAll() {
		$res = $this->conn->query(sprintf('SELECT `id`, `timestamp`, `content` FROM `%s` ORDER BY `id` DESC', $this->table));
		$rows = $res->fetch_all(MYSQLI_ASSOC);
		for ($i = 0; $i < count($rows); ++$i) {
			$rows[$i]['id'] = (int)$rows[$i]['id'];
			$rows[$i]['timestamp'] = (int)$rows[$i]['timestamp'];
		}
		return ['status'=>'ok', 'data'=>$rows];
	}

	public function getById($data) {
		$iderr = checkParamId($data);
		$id = $iderr[0];
		$err = $iderr[1];
		if ($err) {
			return $err;
		}

		$res = $this->conn->query(sprintf('SELECT `id`, `timestamp`, `content` FROM `%s` WHERE `id`=%d LIMIT 1', $this->table, $id));
		$row = $res->fetch_assoc();
		if ($row) {
			$row['id'] = (int)$row['id'];
			$row['timestamp'] = (int)$row['timestamp'];
			return ['status'=>'ok', 'data'=>$row];
		} else {
			return ['status'=>'none_target', 'message'=>'"id" does not exist.'];
		}
	}

	public function add($data) {
		$contenterr = checkParamContent($data);
		$content = $contenterr[0];
		$err = $contenterr[1];
		if ($err) {
			return $err;
		}

		$timestamp = time();
		
		$this->conn->query(sprintf('INSERT INTO `%s` SET `timestamp`=%d, `content`="%s"', $this->table, $timestamp, $content));
		return ['status'=>"ok", 'data'=>['id'=>$this->conn->insert_id, 'timestamp'=>$timestamp, 'content'=>$content]];
	}

	public function modify($data) {
		$iderr = checkParamId($data);
		$id = $iderr[0];
		$err = $iderr[1];
		if ($err) {
			return $err;
		}
		
		$contenterr = checkParamContent($data);
		$content = $contenterr[0];
		$err = $contenterr[1];
		if ($err) {
			return $err;
		}

		$this->conn->query(sprintf('UPDATE `%s` SET `content`="%s" WHERE `id`=%d', $this->table, $content, $id));
		if ($this->conn->affected_rows) {
			return $this->getById(['id'=>$id]);
		} else {
			return ['status'=>'none_target', 'message'=>'"id" does not exist.'];
		}
	}

	public function remove($data) {
		$iderr = checkParamId($data);
		$id = $iderr[0];
		$err = $iderr[1];
		if ($err) {
			return $err;
		}
		
		$this->conn->query(sprintf('DELETE FROM `%s` WHERE `id`=%d', $this->table, $id));
		if ($this->conn->affected_rows) {
			return ['status'=>'ok', 'data'=>['id'=>$id]];
		} else {
			return ['status'=>'none_target', 'message'=>'"id" does not exist.'];
		}
	}
}

?>
