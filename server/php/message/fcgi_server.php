<?php

require_once('../utils/log4php/Logger.php');

date_default_timezone_set('PRC');
Logger::configure(getcwd().'/../utils/log4php/Logger.properties');
$logger = Logger::getLogger('server');

require_once('message_creator.php');

$user = 'root';
$password = 'Ningning~1';

$message = createByMysql($user, $password);

$method =$_SERVER['REQUEST_METHOD'];
if ($method == 'POST') {
	header('Content-Type: text/plain;charset=UTF-8'); 

	$data = file_get_contents("php://input");
	$param = json_decode($data, true);
	$res = $message->request($param);
	$content = json_encode($res);
	
	$logger->info($content);
	file_put_contents("php://output", $content);
} else {
	http_response_code(501);
}

$message->close();

?>
