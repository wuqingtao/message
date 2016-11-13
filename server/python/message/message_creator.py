#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from mysql_holder import MysqlHolder
from mysql_post import MysqlPost
from message import Message

def create_by_mysql(user, password):
    holder = MysqlHolder(user=user, password=password)
    post = MysqlPost(holder.inst())
    return Message(holder, post)
