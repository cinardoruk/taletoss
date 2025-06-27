#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2025 Çınar Doruk
#
# SPDX-License-Identifier: AGPL-3.0-only

:<<COMMENT
drop and recreate psql database in docker container
TODO
* task
COMMENT

set -euo pipefail

# Load .env.prod variables if available
if [ -f .env.prod ]; then
  export $(grep -v '^#' .env.prod | xargs)
fi

# Expected env vars (with fallbacks)
CONTAINER_NAME=${POSTGRES_CONTAINER_NAME:-release-postgres-1}
DB_NAME=${POSTGRES_DB:-yourdbname}
DB_USER=${POSTGRES_USER:-youruser}
DB_PASS=${POSTGRES_PASSWORD:-yourpassword}

echo "Dropping and recreating database '$DB_NAME' inside container '$CONTAINER_NAME'..."

docker exec -e PGPASSWORD="$DB_PASS" "$CONTAINER_NAME" \
  psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
docker exec -e PGPASSWORD="$DB_PASS" "$CONTAINER_NAME" \
  psql -U "$DB_USER" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

echo "✅ Database '$DB_NAME' reset complete."
