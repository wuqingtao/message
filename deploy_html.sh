#!/usr/bin/env sh

local_path=`dirname $0`/html
target_path=/usr/local/nginx/html/message
rm -rf $target_path
mkdir $target_path
cp -r $local_path/* $target_path
