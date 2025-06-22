#!/bin/sh
for f in $1/*.svg; do
	sed -i 's/stroke="#[0-9a-fA-F]\{3,6\}"/stroke="white"/g' "$f"
done
