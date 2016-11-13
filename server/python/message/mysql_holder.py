#!/usr/bin/env python
#-*-coding: utf-8-*-

'''
This module defines the Mysql Holder.
It must implement the interface methods of the Holder.
'''

import os, sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from holder import Holder
import mysql.connector

class MysqlHolder(Holder):
    '''
    A MysqlHolder implements the interface methods of the Holder.
    '''
    def __init__(self, user='', password='', database='message'):
        '''
        Connect to the Mysql and create the database if not existed.
        @param user the username to access the database.
        @param password the password to access the database.
        @param database the Mysql database name.
        '''
        self.__database = database
        self.__conn = mysql.connector.connect(host='localhost', port=3306, user=user, password=password)
        cur = self.__conn.cursor()
        cur.execute('CREATE DATABASE IF NOT EXISTS `%s` default character set utf8 COLLATE utf8_general_ci' % (self.__database))
        cur.execute('USE %s' % (self.__database))
        self.__conn.commit()
        cur.close()

    def inst(self):
        '''
        Return the connector of the Mysql.
        '''
        return self.__conn

    def close(self):
        '''
        Close the connector.
        '''
        self.__conn.close()

    def destroy(self):
        '''
        Drop the database. This method should be called only for testing.
        '''
        cur = self.__conn.cursor()
        cur.execute('DROP DATABASE IF EXISTS `%s`' % (self.__database))
        self.__conn.commit()
        cur.close()
