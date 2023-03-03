#!/bin/bash
echo "Generating Key"

ssh-keygen -q -t rsa  -N '' -f ${KEY_PATH}/id_rsa

./scripts/init.sh