#!/usr/bin/env bash
# ~/.local/bin/tome  (make sure this directory precedes the real one in PATH)

scriptroot=$(dirname "$(realpath "$0")")

# Resolve path to the real tome executable (avoid recursion)
real_tome="$scriptroot/tome.js"

# Detect presence of --stdout among arguments
if [[ " $* " == *" --stdout "* ]]; then
  exec "$real_tome" "$@" 2>/dev/tty
else
  exec "$real_tome" "$@"
fi
