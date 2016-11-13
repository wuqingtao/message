#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../server/python/message/'))
from mysql_holder import MysqlHolder
import mysql.connector
from argparse import ArgumentParser
import unittest

_user = None
_password = None
_database = 'test_message'

class MysqlHolderTest(unittest.TestCase):
    def test(self):
        # Create the Holder connected to the database.
        holder = MysqlHolder(user=_user, password=_password, database=_database)
        
        # Get the connection.
        conn = holder.inst()
        
        # Show all the database's tables.
        cur = conn.cursor()
        cur.execute('SHOW TABLES')
        result = cur.fetchall()
        cur.close()
        self.assertEqual(result, [])
        
        # Destroy the Holder.
        holder.destroy()
        
        # Show all the database's tables again.
        with self.assertRaises(mysql.connector.errors.ProgrammingError):
            cur = conn.cursor()
            cur.execute('SHOW TABLES')
            result = cur.fetchall()
            cur.close()
        
        # Close the Holder.
        holder.close()
        
        # Show all the database's tables again.
        with self.assertRaises(mysql.connector.errors.OperationalError):
            cur = conn.cursor()
            cur.execute('SHOW TABLES')
            result = cur.fetchall()
            cur.close()

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('--user', type=str, help='Mysql username')
    parser.add_argument('--password', type=str, help='Mysql password')
    args = parser.parse_args()
    _user = args.user
    _password = args.password
    del sys.argv[-1:-3:-1]
    unittest.main()
