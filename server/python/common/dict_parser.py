#!/usr/bin/env python
#-*-coding: utf-8-*-

import json

def __decode_list(data):
    rv = []
    for item in data:
        if isinstance(item, unicode):
            item = item.encode('utf-8')
        elif isinstance(item, list):
            item = __decode_list(item)
        elif isinstance(item, dict):
            item = __decode_dict(item)
        rv.append(item)
    return rv

def __decode_dict(data):
    rv = {}
    for key, value in data.iteritems():
        if isinstance(key, unicode):
            key = key.encode('utf-8')
        if isinstance(value, unicode):
            value = value.encode('utf-8')
        elif isinstance(value, list):
            value = __decode_list(value)
        elif isinstance(value, dict):
            value = __decode_dict(value)
        rv[key] = value
    return rv

def decode(dict_str, encoding = 'utf-8'):
    return json.loads(dict_str, encoding = encoding, object_hook = __decode_dict)

def encode(dict_data, encoding = 'utf-8'):
    return json.dumps(dict_data, encoding = encoding, ensure_ascii = False)
