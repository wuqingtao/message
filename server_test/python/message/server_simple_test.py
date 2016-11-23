#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../server/python/common/'))
import dict_parser
import httplib
import time

_host = '120.55.185.245'
_port = 80
_url = '/request_message'

def __request(item):
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

if __name__ == '__main__':
    __request({'type':'get_post_count'})
