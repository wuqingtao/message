#!/usr/bin/env python
#-*-coding: utf-8-*-

'''
This module defines the class Post.
'''

from abc import abstractmethod

class Post:
    '''
    A Post defines the prototype methods of get_count, get_by_id, get_by_ids, add, modify and remove.
    '''
    @abstractmethod
    def get_count(self):
        '''
        Get the total count of posts.
        @return {'status':<status>, 'data':{'count':<count>}}.
        '''

    @abstractmethod
    def get_all(self):
        '''
        Get all the posts.
        '''

    @abstractmethod
    def get_by_id(self, data):
        '''
        Return one post identified by a post ID.
        @param data {'id':<id>}.
        @return {'status':<status>, 'data':{'id':<id>, 'timestamp':<timestamp>, 'content':<content>}}.
        '''

    @abstractmethod
    def add(self, data):
        '''
        Add a post.
        @param data {'content':<content>}
        @return {'status':<status>, 'data':{'id':<id>, 'timestamp':<timestamp>, 'content':<content>}}.
        '''

    @abstractmethod
    def modify(self, data):
        '''
        Modity a existed post.
        @param data {'id':<id>, 'content':<content>}
        @return {'status':<status>, 'data':{'id':<id>, 'timestamp':<timestamp>, 'content':<content>}}.
        '''

    @abstractmethod
    def remove(self, data):
        '''
        Remove a existed post.
        @param data @param data {status:<status>, data:{'id':<id>}}
        '''
