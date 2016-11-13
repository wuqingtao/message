#!/usr/bin/env sh

server=$1
user=$2
password=$3

if [ "$server" != "python" ] && [ "$server" != "ruby" ] && [ "$server" != "node" ] && [ "$server" != "php" ] && [ "$server" != "java" ]; then
	echo "usage: sh start_server.sh <server> <user> <password>"
	echo "       <server> must be python, ruby, node, php or java"
	echo "       <user> mysql access user"
	echo "       <user> mysql access password"
	exit 1
fi

if [ "$user" == "" ] || [ "$password" == "" ]; then
	echo "usage: sh start_server.sh <server> <user> <password>"
	echo "       <server> must be python, ruby, node, php or java"
	echo "       <user> mysql access user"
	echo "       <user> mysql access password"
	exit 1
fi

path=`pwd`
spawn-fcgi -a 127.0.0.1 -p 8401 -F 1 -- $path/server/$server/message/wsgi_server.py --user=$user --password=$password
