#!/usr/bin/env python
#-*-coding: utf-8-*-

import os, sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../common/'))
import dict_parser as dict_parser
import message_creator
from flup.server.fcgi import WSGIServer
from argparse import ArgumentParser

'''
This module defines the WSGI server.
It uses Mysql Holder and Post to instance Holder and Post.
'''

_user = None
_password = None

def application(environ, start_response):
    '''
    This is the WSGIServer application function.
    '''
    requestmethod = environ['REQUEST_METHOD']
    if requestmethod == 'POST':
        param_len = int(environ.get('CONTENT_LENGTH', 0))
        param = environ['wsgi.input'].read(param_len)
        
        param = dict_parser.decode(param)
        print '[request] ' + str(param)
        message = message_creator.create_by_mysql(user=_user, password=_password)
        result = message.request(param)
        message.close()
        print '[response] ' + str(result)
        content = dict_parser.encode(result)

        status = '200 OK'
        response_headers = [('Content-type', 'text/plain;charset=UTF-8')]
        start_response(status, response_headers)
        
        return [content]

if __name__  == '__main__':
    # Parse the app parameters.
    parser = ArgumentParser()
    parser.add_argument('--user', type=str, help='Mysql user')
    parser.add_argument('--password', type=str, help='Mysql password')
    args = parser.parse_args()
    _user = args.user
    _password = args.password

    # # Run directly. ONLY FOR TEST.
    # WSGIServer(application, multithreaded = True, multiprocess = False, bindAddress = ('127.0.0.1', 8401)).run()

    # Run the server by fcgi wrapper.
    WSGIServer(application).run()
