#!/usr/bin/env sh

local_path=`dirname $0`
target_path=$HOME/bin/message
rm -rf $target_path
mkdir -p $target_path
cp -r $local_path/server $target_path
cp -r $local_path/server_test $target_path
