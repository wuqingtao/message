#!/usr/bin/env sh

rm -rf /usr/local/nginx/html/*
mkdir /usr/local/nginx/html/message
path=`pwd`
cp -r $path/html/* /usr/local/nginx/html/message/
