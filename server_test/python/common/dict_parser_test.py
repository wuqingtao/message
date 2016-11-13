#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../server/python/common/'))
from dict_parser import decode, encode
import unittest

class decodeTest(unittest.TestCase):
    def test(self):
        print self.__class__.__name__
        self.assertDictEqual(decode('{}'), {})
        self.assertDictEqual(decode('{"a":1, "b":"2"}'), {'a':1, 'b':'2'})
        self.assertDictEqual(decode('{"我":1, "b":"你"}'), {'我':1, 'b':'你'})
        with self.assertRaises(TypeError):
            decode(None)
            decode(12)
        with self.assertRaises(ValueError):
            decode('')
            decode('ab')
        
class encodeTest(unittest.TestCase):
    def test(self):
        print self.__class__.__name__
        self.assertEqual(encode({}), '{}')
        self.assertEqual(encode({'a':1, 'b':'2'}), '{"a": 1, "b": "2"}')
        self.assertEqual(encode({'我':1, 'b':'你'}), '{"b": "你", "我": 1}')
        self.assertEqual(encode(None), 'null')
        self.assertEqual(encode(12), '12')
        self.assertEqual(encode('ab'), '"ab"')

if __name__ == '__main__':
    unittest.main()
