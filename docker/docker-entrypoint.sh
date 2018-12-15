#!/bin/sh
set -e

for f in /docker-entrypoint.d/*; do
  case "$f" in
    *.sh)
      if [ -x "$f" ]; then
        echo "$0: running $f"
        "$f"
      else
        echo "$0: sourcing $f"
        . "$f"
      fi
      ;;
    *)        echo "$0: ignoring $f" ;;
  esac
  echo
done

exec "$@"
