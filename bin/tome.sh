#!/usr/bin/env bash

scriptroot=$(dirname "$(realpath "$0")")

# Resolve path to the real tome executable (avoid recursion)
real_tome="$scriptroot/tome.js"

# Detect presence of --stdout among arguments and handle stdin accordingly
if [ -t 0 ]; then
    if [[ " $* " == *" --stdout "* ]]; then
        exec "$real_tome" "$1" 2>/dev/tty
    else
        exec "$real_tome" "$1"
    fi
else
    input_data=$(cat)
    if [[ " $* " == *" --stdout "* ]]; then
        exec "$real_tome" "$1" "$input_data" 2>/dev/tty < /dev/tty
    else
        exec "$real_tome" "$1" "$input_data" < /dev/tty
    fi
fi

