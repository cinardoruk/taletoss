#!/bin/sh

# SPDX-FileCopyrightText: 2025 Çınar Doruk
#
# SPDX-License-Identifier: AGPL-3.0-only

for f in $1/*.svg; do
	sed -i 's/stroke="#[0-9a-fA-F]\{3,6\}"/stroke="white"/g' "$f"
done
