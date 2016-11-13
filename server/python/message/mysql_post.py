#!/usr/bin/env python
#-*-coding: utf-8-*-

'''
This module defines the Mysql Post.
It must implement the interface methods of the Post.
'''

import os, sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from post import Post
import mysql.connector
import time
from datetime import datetime
import checker

class MysqlPost(Post):
    '''
    MysqlPost is the Mysql implement of Post.
    '''
    def __init__(self, conn, table='post'):
        '''
        Save the conn and table, create the table if not exits.
        @param conn mysql conncetor.
        @param table table name for the post.
        '''
        self.__conn = conn
        self.__table = table
        cur = self.__conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS `%s` (
                `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                `timestamp` INT NOT NULL,
                `content` TEXT NOT NULL
            )''' % (self.__table))
        self.__conn.commit()
        cur.close()

    def get_count(self):
        '''
        Get the total count of posts.
        @return {'status':<status>, 'data':{'count':<count>}}.
        '''
        cur = self.__conn.cursor()
        cur.execute('SELECT COUNT(`id`) AS count FROM `%s`' % (self.__table))
        result = cur.fetchone()
        cur.close()
        data = self.__convert_count_result(result)
        return {'status':"ok", "data":data}

    def get_all(self):
        '''
        Return all the posts.
        @return {'status':<status>, 'data':[{'id':<id>, 'timestamp':<timestamp>, 'content':<content>}, ...]}.
        '''
        cur = self.__conn.cursor()
        cur.execute('SELECT `id`,`timestamp`,`content` FROM `%s` ORDER BY `id` DESC' % (self.__table))
        result = cur.fetchall()
        cur.close()
        data = self.__convert_result(result)
        return {'status':"ok", "data":data}

    def get_by_id(self, data):
        '''
        Return one post identified by a post ID.
        @param data {'id':<id>}.
        @return {'status':<status>, 'data':{'id':<id>, 'timestamp':<timestamp>, 'content':<content>}}.
        '''
        id, err = checker.check_param_id(data)
        if err:
            return err
        cur = self.__conn.cursor()
        cur.execute('SELECT `id`,`timestamp`,`content` FROM `%s` WHERE `id`=%d LIMIT 1' % (self.__table, id))
        result = cur.fetchone()
        cur.close()
        if not result:
            return {'status':"none_target", "message":'"id" does not exist'}
        data = self.__convert_one_result(result)
        return {'status':"ok", "data":data}

    def add(self, data):
        '''
        Add a post.
        @param data {'content':<content>}
        @return {'status':<status>, 'data':{'id':<id>, 'timestamp':<timestamp>, 'content':<content>}}.
        '''
        content, err = checker.check_param_content(data)
        if err:
            return err
        timestamp = int(time.mktime(datetime.now().timetuple()))
        cur = self.__conn.cursor()
        cur.execute('INSERT INTO `%s` SET `timestamp`=%d,`content`="%s"' % (self.__table, timestamp, content))
        self.__conn.commit()
        id = cur.lastrowid
        cur.close()
        return {'status':"ok", 'data':{'id':id, 'timestamp':timestamp, 'content':content}}

    def modify(self, data):
        '''
        Modity a existed post.
        @param data {'id':<id>, 'content':<content>}
        @return {'status':<status>, 'data':{'id':<id>, 'timestamp':<timestamp>, 'content':<content>}}.
        '''
        id, err = checker.check_param_id(data)
        if err:
            return err
        content, err = checker.check_param_content(data)
        if err:
            return err
        values = []
        if content:
            values.append('`content`="' + content + '"')
        cmd = 'UPDATE `' + self.__table + '` SET ' + ','.join(values) + ' WHERE `id`=' + str(id)
        cur = self.__conn.cursor()
        cur.execute(cmd)
        self.__conn.commit()
        modified = cur.rowcount == 1
        cur.close()
        if not modified:
            return {'status':"none_target", "message":'"id" does not exist'}
        return self.get_by_id({'id':id})

    def remove(self, data):
        '''
        Remove a existed post.
        @param data @param data {status:<status>, data:{'id':<id>}}
        '''
        id, err = checker.check_param_id(data)
        if err:
            return err
        cur = self.__conn.cursor()
        cur.execute('DELETE FROM `%s` WHERE `id`=%d' % (self.__table, id))
        self.__conn.commit()
        deleted = cur.rowcount == 1
        cur.close()
        if not deleted:
            return {'status':"none_target", "message":'"id" does not exist'}
        return {'status':"ok", "data":{'id':id}}

    def __convert_result(self, result):
        '''
        Convert result of tuple array to dict array.
        @param result [(id, timestamp, content)]
        @return [{'id':<id>, 'timestamp':<timestamp>, 'content'<content>}]
        '''
        data = []
        for id, timestamp, content in result:
            data.append({'id':id, 'timestamp':timestamp, 'content':content.encode('utf-8')})
        return data

    def __convert_one_result(self, result):
        '''
        Convert one result of array to dict.
        @param result (id, timestamp, content)
        @return {'id':<id>, 'timestamp':<timestamp>, 'content'<content>}
        '''
        id, timestamp, content = result
        return {'id':id, 'timestamp':timestamp, 'content':content.encode('utf-8')}

    def __convert_count_result(self, result):
        '''
        Convert count result of tuple to dict.
        @param result (count, )
        @return {'count':<count>}
        '''
        count, = result
        return {'count':count}
