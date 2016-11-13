#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../server/python/message/'))
from checker import *
import unittest

class CheckerTest(unittest.TestCase):
    def test_check_param_type(self):
        with self.assertRaises(AttributeError):
            check_param_type(None)
            check_param_type('')
            check_param_type(123)
        self.assertEqual(check_param_type({}), (None, {'status':'lost_parameter', 'message':'"type" is necessary.'}))
        self.assertEqual(check_param_type({'abcd':'1234'}), (None, {'status':'lost_parameter', 'message':'"type" is necessary.'}))
        self.assertEqual(check_param_type({'Type':'1234'}), (None, {'status':'lost_parameter', 'message':'"type" is necessary.'}))
        self.assertEqual(check_param_type({'type':1234}), (None, {'status':'invalid_parameter', 'message':'"type" should be string and not null.'}))
        self.assertEqual(check_param_type({'type':''}), (None, {'status':'invalid_parameter', 'message':'"type" should be string and not null.'}))
        self.assertEqual(check_param_type({'type':'1234'}), ('1234', None))

    def test_check_param_id(self):
        self.assertEqual(check_param_id({}), (None, {'status':'lost_parameter', 'message':'"id" is necessary.'}))
        self.assertEqual(check_param_id({'abcd':1234}), (None, {'status':'lost_parameter', 'message':'"id" is necessary.'}))
        self.assertEqual(check_param_id({'Id':1234}), (None, {'status':'lost_parameter', 'message':'"id" is necessary.'}))
        self.assertEqual(check_param_id({'id':'1234'}), (None, {'status':'invalid_parameter', 'message':'"id" should be int.'}))
        self.assertEqual(check_param_id({'id':1234}), (1234, None))

    def test_check_param_ids(self):
        self.assertEqual(check_param_ids({}), (None, {'status':'lost_parameter', 'message':'"ids" is necessary.'}))
        self.assertEqual(check_param_ids({'abcd':1234}), (None, {'status':'lost_parameter', 'message':'"ids" is necessary.'}))
        self.assertEqual(check_param_ids({'Ids':1234}), (None, {'status':'lost_parameter', 'message':'"ids" is necessary.'}))
        self.assertEqual(check_param_ids({'ids':'1234'}), (None, {'status':'invalid_parameter', 'message':'"ids" should be list and not empty.'}))
        self.assertEqual(check_param_ids({'ids':[]}), (None, {'status':'invalid_parameter', 'message':'"ids" should be list and not empty.'}))
        self.assertEqual(check_param_ids({'ids':[1234, '1234']}), (None, {'status':'invalid_parameter', 'message':'"id" should be int.'}))

    def test_check_param_content(self):
        self.assertEqual(check_param_content({}), (None, {'status':'lost_parameter', 'message':'"content" is necessary.'}))
        self.assertEqual(check_param_content({'abcd':'1234'}), (None, {'status':'lost_parameter', 'message':'"content" is necessary.'}))
        self.assertEqual(check_param_content({'Content':'1234'}), (None, {'status':'lost_parameter', 'message':'"content" is necessary.'}))
        self.assertEqual(check_param_content({'content':1234}), (None, {'status':'invalid_parameter', 'message':'"content" should be string and not null.'}))
        self.assertEqual(check_param_content({'content':''}), (None, {'status':'invalid_parameter', 'message':'"content" should be string and not null.'}))
        self.assertEqual(check_param_content({'content':'1234'}), ('1234', None))

if __name__ == '__main__':
    unittest.main()
