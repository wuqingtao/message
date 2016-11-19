#!/usr/bin/env sh

server=$1
user=$2
password=$3

endfix=
if [ "$server" == "python" ]; then
	endfix="py"
elif [ "$server" == "node" ]; then
	endfix="js"
elif [ "$server" == "php" ]; then
	endfix="php"
elif [ "$server" == "java" ]; then
	endfix="java"
fi

if [ "$endfix" == "" ] || [  "$user" == "" ] || [ "$password" == "" ]; then
	echo "usage: sh start_server.sh <server> <user> <password>"
	echo "       <server> must be python, node, php or java"
	echo "       <user> mysql access user"
	echo "       <user> mysql access password"
	exit 1
fi

target=`dirname $0`/$server/message/fcgi_server.$endfix
chmod +x $target
spawn-fcgi -a 127.0.0.1 -p 8401 -F 1 -- $target --user=$user --password=$password
