#!/usr/bin/env sh

server=$1
if [ "$server" == "python" ]; then
	user=$2
	password=$3
	if [  "$user" == "" ] || [ "$password" == "" ]; then
		echo "Usage: sh start_server.sh python <user> <password>"
		echo "       <user> mysql access user, no need for php"
		echo "       <password> mysql access password, no need for php"
		exit 1
	fi
	target=`dirname $0`/$server/message/fcgi_server.py
	chmod +x $target
	spawn-fcgi -a 127.0.0.1 -p 8401 -F 1 -- $target --user=$user --password=$password
elif [ "$server" == "node" ]; then
	user=$2
	password=$3
	if [  "$user" == "" ] || [ "$password" == "" ]; then
		echo "Usage: sh start_server.sh node <user> <password>"
		echo "       <user> mysql access user, no need for php"
		echo "       <password> mysql access password, no need for php"
		exit 1
	fi
	target=`dirname $0`/$server/message/fcgi_server.js
	chmod +x $target
	spawn-fcgi -a 127.0.0.1 -p 8401 -F 1 -- $target --user=$user --password=$password
elif [ "$server" == "php" ]; then
	target=`which php-cgi`
	spawn-fcgi -a 127.0.0.1 -p 8401 -F 1 -- $target
elif [ "$server" == "java" ]; then
	user=$2
	password=$3
	if [  "$user" == "" ] || [ "$password" == "" ]; then
		echo "Usage: sh start_server.sh java <user> <password>"
		echo "       <user> mysql access user, no need for php"
		echo "       <password> mysql access password, no need for php"
		exit 1
	fi
	# TDOD: target=
	# TDOD: spawn-fcgi -a 127.0.0.1 -p 8401 -F 1 -- $target --user=$user --password=$password
else
	echo "Usage: sh start_server.sh python <user> <password>"
	echo "       sh start_server.sh node <user> <password>"
	echo "       sh start_server.sh php"
	echo "       sh start_server.sh java <user> <password>"
	echo "       <user> mysql access user"
	echo "       <password> mysql access password"
fi
