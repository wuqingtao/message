#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../server/python/common/'))
import dict_parser
import httplib
import time
from argparse import ArgumentParser
import unittest

_host = None
_port = None
_url = None

class ServerTest(unittest.TestCase):
    def __request(self, item):
        item['test'] = True
        param = dict_parser.encode(item)
        print 'request:' + param
        conn = None
        try:
            bt = time.time()
            conn = httplib.HTTPConnection(_host, _port)
            headers = {'Content-type':'text/plain;charset=utf-8'}
            conn.request('POST', _url, param, headers)
            response = conn.getresponse()
            status = response.status
            content = response.read()
            et = time.time()
            print 'elapse:' + str(et - bt) + 's'
            print 'status:' + str(status)
            print 'content:' + content
            print
            result = dict_parser.decode(content)
            return result
        finally:
            if conn:
                conn.close

    def test_get_post_count(self):
        '''
        测试{'type':'get_post_count'}
        '''
        # 获取post个数
        result = self.__request({'type':'get_post_count'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertTrue(result['data']['count'] >= 0)
        pre_count = result['data']['count']
        
        # 添加两个post
        result = self.__request({'type':'add_post', 'content':'test content 1'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertTrue(result['data']['timestamp'] > 0)
        self.assertEqual(result['data']['content'], 'test content 1')
        id1 = result['data']['id']
        
        result = self.__request({'type':'add_post', 'content':'test content 2'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertTrue(result['data']['timestamp'] > 0)
        self.assertEqual(result['data']['content'], 'test content 2')
        id2 = result['data']['id']
        
        # 获取post个数
        result = self.__request({'type':'get_post_count'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertTrue(result['data']['count'] >= 0)
        now_count = result['data']['count']
        
        # 获取所有post
        result = self.__request({'type':'get_all_post'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertEqual(result['data'][0]['content'], 'test content 2')
        self.assertEqual(result['data'][0]['id'], id2)
        self.assertEqual(result['data'][1]['content'], 'test content 1')
        self.assertEqual(result['data'][1]['id'], id1)
        
        # 根据ID获取post
        result = self.__request({'type':'get_post_by_id', 'id':id2})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertEqual(result['data']['id'], id2)
        self.assertEqual(result['data']['content'], 'test content 2')

        result = self.__request({'type':'get_post_by_id', 'id':id1})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertEqual(result['data']['id'], id1)
        self.assertEqual(result['data']['content'], 'test content 1')

        # 删除post
        result = self.__request({'type':'remove_post', 'id':id2})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertEqual(result['data']['id'], id2)
        
        # 获取所有post
        result = self.__request({'type':'get_all_post'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertEqual(result['data'][0]['content'], 'test content 1')
        self.assertEqual(result['data'][0]['id'], id1)

        # 删除post
        result = self.__request({'type':'remove_post', 'id':id1})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertEqual(result['data']['id'], id1)

        # 获取post个数
        result = self.__request({'type':'get_post_count'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        self.assertTrue(result['data']['count'] >= 0)
        last_count = result['data']['count']

        # 测试post个数变化
        self.assertEqual(pre_count, last_count)
        self.assertEqual(pre_count, now_count - 2)
        
        # 清理测试相关的post
        result = self.__request({'type':'get_all_post'})
        for post in result['data']:
            content = post['content']
            if content.startswith('test content'):
                id = post['id']
                self.__request({'type':'remove_post', 'id':id})

if __name__ == '__main__':
    # Parse the app parameters.
    parser = ArgumentParser()
    parser.add_argument('--host', type=str)
    parser.add_argument('--port', type=int)
    parser.add_argument('--url', type=str)
    args = parser.parse_args()
    _host = args.host
    _port = args.port
    _url = args.url

    # 删除自定义命令行参数，防止unittest解析错误
    del sys.argv[-1:-4:-1]

    # 启动测试
    unittest.main()
