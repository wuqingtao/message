#!/usr/bin/env python
#-*-coding: utf-8-*-

'''
This module defines the database Holder. 
The inheritence can be Mysql, Postgresql, Mongodb or others.
'''

from abc import abstractmethod

class Holder:
    '''
    A Holder defines the protocol methods of inst, close and destroy.
    '''
    @abstractmethod
    def inst(self):
        '''
        Return the instance of the Holder.
        For Mysql, it can be MySQLConnection.
        @return the instance of the Holder.
        '''

    @abstractmethod
    def close(self):
        '''
        Close the holder.
        '''

    @abstractmethod
    def destroy(self):
        '''
        Destroy the holder.
        '''
