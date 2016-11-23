<?php

require_once('checker.php');

class Message {
	private $holder;
	private $post;
	
	public function __construct($holder, $post) {
		$this->holder = $holder;
		$this->post = $post;
	}
	
	public function request($data) {
		$typeerr = checkParamType($data);
		$type = $typeerr[0];
		$err = $typeerr[1];
		if ($err) {
			return $err;
		}

		if ($type == 'get_post_count') {
			return $this->post->getCount();
		} else if ($type == 'get_all_post') {
			return $this->post->getAll();
		} else if ($type == 'get_post_by_id') {
			return $this->post->getById($data);
		} else if ($type == 'add_post') {
			return $this->post->add($data);
		} else if ($type == 'modify_post') {
			return $this->post->modify($data);
		} else if ($type == 'remove_post') {
			return $this->post->remove($data);
		} else {
			return ['status'=>'invalid_parameter', 'message'=>'"type" is invalid.'];
		}
	}
	
	public function close() {
		$this->holder->close();
	}
}

?>
