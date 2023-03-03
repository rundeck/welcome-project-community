#!/bin/bash

progress_tic() { if [[ -t 1 ]]; then printf -- "%s" "$@"; else printf -- "%s\n" "$@" ;  fi ; }

echo "Running as user: $(whoami)"

INTERVAL=5
MAXTRY=10
attempts=0

KEY_FILE="$KEY_PATH/id_rsa"
while (( attempts <= MAXTRY ))
do
    if ! test -f "$KEY_FILE"
    then  progress_tic "."; # output a progress string.
    else  break; # file exists
    fi
    (( attempts += 1 ))  ; # increment attempts attemptser.
    (( attempts == MAXTRY )) && {
        echo "FAIL: Reached max try file exists: $KEY_FILE. Exiting."
        exit 1
    }
    sleep "$INTERVAL"; # wait before trying again.
done

echo "OK: file exists: $(ls -l "$KEY_FILE")"

mkdir /configuration
cp $KEY_PATH/id_rsa /configuration/
cp $KEY_PATH/id_rsa.pub /configuration/
