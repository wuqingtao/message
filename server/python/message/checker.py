#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

def check_param_type(data):
    if not data.has_key('type'):
        return (None, {'status':'lost_parameter', 'message':'"type" is necessary.'})
    type = data['type']
    if not isinstance(type, str) or not type:
        return (None, {'status':'invalid_parameter', 'message':'"type" should be string and not null.'})
    return (type, None)

def check_param_id(data):
    if not data.has_key('id'):
        return (None, {'status':'lost_parameter', 'message':'"id" is necessary.'})
    id = data['id']
    if not isinstance(id, int):
        return (None, {'status':'invalid_parameter', 'message':'"id" should be int.'})
    return (id, None)

def check_param_content(data):
    if not data.has_key('content'):
        return (None, {'status':'lost_parameter', 'message':'"content" is necessary.'})
    content = data['content']
    if not isinstance(content, str) or not content:
        return (None, {'status':'invalid_parameter', 'message':'"content" should be string and not null.'})
    return (content, None)
