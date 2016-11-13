#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../server/python/message/'))
from message import Message
from post import Post
from holder import Holder
import unittest

class TestHolder(Holder):
    def inst(self):
        return None

    def close(self):
        return None

    def destroy(self):
        return None

class TestPost(Post):
    def get_count(self):
        return {'status':'ok', 'data':{'count':1234}}

    def get_all(self):
        return {'status':'ok', 'data':[{'id':1234, 'timestamp':123456, 'content':'abcd'}, {'id':12345, 'timestamp':1234567, 'content':'abcde'}]}

    def get_by_id(self, data):
        return {'status':'ok', 'data':{'id':1234, 'timestamp':123456, 'content':'abcd'}}

    def get_by_ids(self, data):
        return {'status':'ok', 'data':[{'id':1234, 'timestamp':123456, 'content':'abcd'}, {'id':12345, 'timestamp':1234567, 'content':'abcde'}]}

    def add(self, data):
        return {'status':'ok', 'data':{'id':1234, 'timestamp':123456, 'content':'abcd'}}

    def modify(self, data):
        return {'status':'ok', 'data':{'id':1234, 'timestamp':123456, 'content':'abcd'}}

    def remove(self, data):
        return {'status':'ok', 'data':{'id':1234}}

class MessageTest(unittest.TestCase):
    def test_request(self):
        holder = TestHolder()
        post = TestPost()
        message = Message(holder, post)
        self.assertEqual(message.request({}), {'status':'lost_parameter', 'message':'"type" is necessary.'})
        self.assertEqual(message.request({'type':'abcd'}), {'status':'invalid_parameter', 'message':'"type" is invalid.'})
        self.assertEqual(message.request({'type':'get_post_count'}), post.get_count())
        self.assertEqual(message.request({'type':'get_all_post'}), post.get_all())
        self.assertEqual(message.request({'type':'get_post_by_id'}), post.get_by_id({}))
        self.assertEqual(message.request({'type':'get_post_by_ids'}), post.get_by_ids({}))
        self.assertEqual(message.request({'type':'add_post'}), post.add({}))
        self.assertEqual(message.request({'type':'modify_post'}), post.modify({}))
        self.assertEqual(message.request({'type':'remove_post'}), post.remove({}))
        self.assertEqual(message.close(), None)

if __name__ == '__main__':
    unittest.main()
