#!/usr/bin/env python
#-*-coding: utf-8-*-

'''
该模块定义了一个用于测试MysqlPost的测试类
'''

import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../server/python/message/'))
from mysql_holder import MysqlHolder
from mysql_post import MysqlPost
import mysql.connector
import time
from datetime import datetime
from argparse import ArgumentParser
import unittest

# 数据库接入用户名
_user = None
# 数据库接入密码
_password = None
# 测试数据库名称，注意：不要修改该名称，防止意外删除正式数据库
_database = 'test_message'

class MysqlPostTest(unittest.TestCase):
    '''
    该类用于测试MysqlPost类的公共方法的实现，这些公共方法在协议类Post中严格定义
    '''
    # 预定义一组用测试的post内容
    __test_posts = [
        {'content':'abcdefghijklmnopqrstuvwxyz'},
        {'content':'ABCDEFGHIJKLMNOPQRSTUVWXYZ'},
        {'content':'1234567890'},
        {'content':'红尘世界？一片雾茫茫！'},
        {'content':'<p>红尘世界？<em>一片雾茫茫！</em></p>'},
    ]

    def setUp(self):
        '''
        重载unittest.TestCase的初始化函数，每个测试函数执行前都会被调用
        '''
        self.__holder = MysqlHolder(user=_user, password=_password, database=_database)
        self.__post = MysqlPost(self.__holder.inst())

    def tearDown(self):
        '''
        重载unittest.TestCase的清理函数，每个测试函数执行前都会被调用
        '''
        self.__holder.destroy()
        self.__holder.close()

    def test_get_count(self):
        '''
        测试MysqlPost的get_count函数
        '''
        # 测试空的post个数
        result = self.__post.get_count()
        self.assertEqual(result, {'status':'ok', 'data':{'count':0}})

        # 测试非空的post个数
        for post in self.__test_posts:
            self.__post.add(post)
        result = self.__post.get_count()
        self.assertEqual(result, {'status':'ok', 'data':{'count':len(self.__test_posts)}})

    def test_get_all(self):
        '''
        测试MysqlPost的get_all函数
        '''
        # 测试空的post返回
        result = self.__post.get_all()
        self.assertEqual(result, {'status':'ok', 'data':[]})

        # 添加自定义的post
        for post in self.__test_posts:
            self.__post.add(post)

        # 获取get_all的返回
        result = self.__post.get_all()

        # 测试返回状态
        self.assertEqual(result['status'], 'ok')

        # 测试返回结果
        # 判断每个post的id是否合法
        # 判断每个post的timestamp是否合法。是否符合时间先后顺序
        # 判断每个post的content的值是否和添加的一致
        saved_timestamp = sys.maxint
        saved_posts = []
        for post in result['data']:
            id = post['id']
            self.assertTrue(isinstance(id, int) and id > 0)
            timestamp = post['timestamp']
            dt = datetime.fromtimestamp(timestamp)
            cur_timestamp = int(time.mktime(datetime.now().timetuple()))
            cur_dt = datetime.fromtimestamp(cur_timestamp)
            self.assertEqual(dt.date(), cur_dt.date())
            self.assertTrue(timestamp <= saved_timestamp)
            saved_timestamp = timestamp
            saved_posts.append({'content':post['content']})
        self.assertEqual(saved_posts, self.__test_posts[::-1])

    def test_get_by_id(self):
        '''
        测试MysqlPost的get_by_id函数
        '''
        # 测试非法参数输入
        result = self.__post.get_by_id({'ID':1})
        self.assertDictContainsSubset({'status':'lost_parameter'}, result)
        result = self.__post.get_by_id({'id':'1234'})
        self.assertDictContainsSubset({'status':'invalid_parameter'}, result)

        # 添加自定义的post
        for post in self.__test_posts:
            self.__post.add(post)

        # 通过get_all获取所有的post，用于比对
        result = self.__post.get_all()
        posts = result['data']

        # 分别调用get_by_id，判断返回的post和get_all返回的是否一致
        for post in posts:
            result = self.__post.get_by_id({'id':post['id']})
            self.assertEqual(result, {'status':'ok', 'data':post})

        # 输入异常id值，看返回的值是否为空
        result = self.__post.get_by_id({'id':sys.maxint})
        self.assertDictContainsSubset({'status':'none_target'}, result)

    def test_add(self):
        result = self.__post.add({'CONTENT':''})
        self.assertDictContainsSubset({'status':'lost_parameter'}, result)
        result = self.__post.add({'content':1234})
        self.assertDictContainsSubset({'status':'invalid_parameter'}, result)
        result = self.__post.add({'content':''})
        self.assertDictContainsSubset({'status':'invalid_parameter'}, result)
        result = self.__post.add({'content':'content'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        id = result['data']['id']
        self.assertTrue(isinstance(id, int) and id > 0)
        timestamp = result['data']['timestamp']
        self.assertTrue(isinstance(timestamp, int) and timestamp > 0)
        content = result['data']['content']
        self.assertEqual(content, 'content')

    def test_modify(self):
        '''
        测试MysqlPost的modify函数
        '''
        # 测试非法参数输入
        result = self.__post.modify({'ID':1234})
        self.assertDictContainsSubset({'status':'lost_parameter'}, result)
        result = self.__post.modify({'id':'1234'})
        self.assertDictContainsSubset({'status':'invalid_parameter'}, result)
        result = self.__post.modify({'id':1234})
        self.assertDictContainsSubset({'status':'lost_parameter'}, result)
        result = self.__post.modify({'id':1234, 'content':'content'})
        self.assertDictContainsSubset({'status':'none_target'}, result)

        # 添加一个post
        self.__post.add({'content':'content'})

        # 获取返回的post，用于比对
        result = self.__post.get_all()
        pre_data = result['data'][0]

        # 修改post内容，判断返回的状态。保存返回的data
        result = self.__post.modify({'id':pre_data['id'], 'content':'CONTENT'})
        self.assertDictContainsSubset({'status':'ok'}, result)
        modified_data = result['data']

        # 通过get_all返回post内容
        result = self.__post.get_all()
        now_data = result['data'][0]

        # 判断post的id和timestamp是否改变
        # 判断修改的content是否正确
        # 比对modify返回的data和get_all返回的data是否一致
        self.assertEqual(pre_data['id'], modified_data['id'])
        self.assertEqual(pre_data['timestamp'], modified_data['timestamp'])
        self.assertEqual(modified_data['content'], 'CONTENT')
        self.assertEqual(modified_data, now_data)

    def test_remove(self):
        '''
        测试MysqlPost的remove函数
        '''
        # 测试非法参数输入
        result = self.__post.remove({'ID':0})
        self.assertDictContainsSubset({'status':'lost_parameter'}, result)
        result = self.__post.remove({'id':'1234'})
        self.assertDictContainsSubset({'status':'invalid_parameter'}, result)
        result = self.__post.remove({'id':1234})
        self.assertDictContainsSubset({'status':'none_target'}, result)

        # 添加一个post，为功能做准备
        self.__post.add({'content':'content'})

        # 获取添加的post的data
        result = self.__post.get_all()
        data = result['data'][0]

        # 测试删除功能是否正常
        result = self.__post.remove({'id':data['id']})
        self.assertEqual(result, {'status':'ok', 'data':{'id':data['id']}})

if __name__ == '__main__':
    # 出于安全考虑，数据用户名和密码不应该明文，考虑通过命令函参数输入
    parser = ArgumentParser()
    parser.add_argument('--user', type=str, help='Mysql username')
    parser.add_argument('--password', type=str, help='Mysql password')
    args = parser.parse_args()
    _user = args.user
    _password = args.password
    
    # 删除自定义命令行参数，防止unittest解析错误
    del sys.argv[-1:-3:-1]
    
    # 启动测试
    unittest.main()
