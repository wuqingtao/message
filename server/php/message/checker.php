<?php

function checkParamType($data) {
	if (gettype($data) != 'array' || !array_key_exists('type', $data)) {
		return [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']];
	}
	$type = $data['type'];
	if (gettype($type) != 'string' || empty($type)) {
		return [null, ['status'=>'invalid_parameter', 'message'=>'"type" should be string and not null.']];
	}
	return [$type, null];
}

function checkParamId($data) {
	if (!array_key_exists('id', $data)) {
		return [null, ['status'=>'lost_parameter', 'message'=>'"id" is necessary.']];
	}
	$id = $data['id'];
	if (gettype($id) != 'integer') {
		return [null, ['status'=>'invalid_parameter', 'message'=>'"id" should be int.']];
	}
	return [$id, null];
}

function checkParamContent($data) {
    if (!array_key_exists('content', $data)) {
        return [null, ['status'=>'lost_parameter', 'message'=>'"content" is necessary.']];
	}
    $content = $data['content'];
    if (gettype($content) != 'string' || empty($content)) {
        return [null, ['status'=>'invalid_parameter', 'message'=>'"content" should be string and not null.']];
	}
    return [$content, null];
}

?>
