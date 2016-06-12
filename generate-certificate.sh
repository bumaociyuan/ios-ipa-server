#!/usr/bin/bash

ip=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
cerDir="$HOME/.ios-ipa-server/"$ip"/"
echo $ip
echo $cerDir
mkdir -p "$cerDir"

openssl genrsa -out "$cerDir"myCA.key 2048

openssl req -x509 -new -key "$cerDir"myCA.key -out "$cerDir"myCA.cer -days 730 -subj /CN="ios-ipa-server Custom CA"

openssl genrsa -out "$cerDir"mycert1.key 2048

openssl req -new -out "$cerDir"mycert1.req -key "$cerDir"mycert1.key -subj /CN=$ip

openssl x509 -req -in "$cerDir"mycert1.req -out "$cerDir"mycert1.cer -CAkey "$cerDir"myCA.key -CA "$cerDir"myCA.cer -days 365 -CAcreateserial -CAserial "$cerDir"serial
