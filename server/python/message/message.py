#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from post import Post
import checker

class Message:
    def __init__(self, holder, post):
        self.__holder = holder
        self.__post = post

    def request(self, data):
        type, err = checker.check_param_type(data)
        if err:
            return err
        if type == 'get_post_count':
            return self.__post.get_count()
        elif type == 'get_all_post':
            return self.__post.get_all()
        elif type == 'get_post_by_id':
            return self.__post.get_by_id(data)
        elif type == 'get_post_by_ids':
            return self.__post.get_by_ids(data)
        elif type == 'add_post':
            return self.__post.add(data)
        elif type == 'modify_post':
            return self.__post.modify(data)
        elif type == 'remove_post':
            return self.__post.remove(data)
        else:
            return {'status':'invalid_parameter', 'message':'"type" is invalid.'}

    def close(self):
        self.__holder.close()
