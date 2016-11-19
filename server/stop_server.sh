#!/usr/bin/env sh

kill -9 $(ps -ef|grep message/fcgi_server|gawk '$0 !~/grep/ {print $2}' |tr -s '\n' ' ')
