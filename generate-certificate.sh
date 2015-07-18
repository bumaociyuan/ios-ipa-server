#!/usr/bin/bash

mkdir cer
cd cer

ip=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
echo $ip

openssl genrsa -out myselfsigned.key 2048

openssl req -new -x509 -key myselfsigned.key -out myselfsigned.cer -days 365 -subj /CN=$ip

openssl pkcs12 -export -out myselfsigned.pfx -inkey myselfsigned.key -in myselfsigned.cer

openssl genrsa -out myCA.key 2048

openssl req -x509 -new -key myCA.key -out myCA.cer -days 730 -subj /CN="ZX Custom CA"

openssl genrsa -out mycert1.key 2048

openssl req -new -out mycert1.req -key mycert1.key -subj /CN=$ip

openssl x509 -req -in mycert1.req -out mycert1.cer -CAkey myCA.key -CA myCA.cer -days 365 -CAcreateserial -CAserial serial