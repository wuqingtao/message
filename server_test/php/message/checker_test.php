<?php

use PHPUnit\Framework\TestCase;
require_once('../../../server/php/message/checker.php');

class CheckerTest extends TestCase {
	public function test_checkParamType() {
		$this->assertEquals(checkParamType(null), [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']]);
		$this->assertEquals(checkParamType(null), [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']]);
		$this->assertEquals(checkParamType(1), [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']]);
		$this->assertEquals(checkParamType(''), [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']]);
		$this->assertEquals(checkParamType([]), [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']]);
        $this->assertEquals(checkParamType(['abcd'=>'1234']), [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']]);
        $this->assertEquals(checkParamType(['Type'=>'1234']), [null, ['status'=>'lost_parameter', 'message'=>'"type" is necessary.']]);
        $this->assertEquals(checkParamType(['type'=>1234]), [null, ['status'=>'invalid_parameter', 'message'=>'"type" should be string and not null.']]);
        $this->assertEquals(checkParamType(['type'=>'']), [null, ['status'=>'invalid_parameter', 'message'=>'"type" should be string and not null.']]);
        $this->assertEquals(checkParamType(['type'=>'1234']), ['1234', null]);
	}
	
	public function test_checkParamId() {
		$this->assertEquals(checkParamId([]), [null, ['status'=>'lost_parameter', 'message'=>'"id" is necessary.']]);
		$this->assertEquals(checkParamId(['abcd'=>1234]), [null, ['status'=>'lost_parameter', 'message'=>'"id" is necessary.']]);
		$this->assertEquals(checkParamId(['Id'=>1234]), [null, ['status'=>'lost_parameter', 'message'=>'"id" is necessary.']]);
		$this->assertEquals(checkParamId(['id'=>'1234']), [null, ['status'=>'invalid_parameter', 'message'=>'"id" should be int.']]);
		$this->assertEquals(checkParamId(['id'=>1234]), [1234, null]);
	}

	public function test_checkParamContent() {
		$this->assertEquals(checkParamContent([]), [null, ['status'=>'lost_parameter', 'message'=>'"content" is necessary.']]);
		$this->assertEquals(checkParamContent(['abcd'=>'1234']), [null, ['status'=>'lost_parameter', 'message'=>'"content" is necessary.']]);
		$this->assertEquals(checkParamContent(['Content'=>'1234']), [null, ['status'=>'lost_parameter', 'message'=>'"content" is necessary.']]);
		$this->assertEquals(checkParamContent(['content'=>1234]), [null, ['status'=>'invalid_parameter', 'message'=>'"content" should be string and not null.']]);
		$this->assertEquals(checkParamContent(['content'=>'']), [null, ['status'=>'invalid_parameter', 'message'=>'"content" should be string and not null.']]);
		$this->assertEquals(checkParamContent(['content'=>'1234']), ['1234', null]);
	}
}

?>
