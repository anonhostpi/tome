#!/usr/bin/env sh

scriptroot=$(dirname "$(realpath "$0")")
real_tome="$scriptroot/tome.js"

case " $* " in
  *" --stdout "*) has_stdout=1 ;;
  *) has_stdout=0 ;;
esac

args=
for arg in "$@"; do
  [ "$arg" = "--stdout" ] || args="$args \"$arg\""
done

eval "set -- $args"

# Detect presence of --stdout among arguments and handle stdin accordingly
if [ -t 0 ]; then
    if [ "$has_stdout" -eq 1 ]; then
        exec "$real_tome" "$1" --stdout 2>/dev/tty
    else
        exec "$real_tome" "$1"
    fi
else
    input_data=$(cat)
    if [ "$has_stdout" -eq 1 ]; then
        exec "$real_tome" "$1" "$input_data" --stdout 2>/dev/tty < /dev/tty
    else
        exec "$real_tome" "$1" "$input_data" < /dev/tty
    fi
fi

