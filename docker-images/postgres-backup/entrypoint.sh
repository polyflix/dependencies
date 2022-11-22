#!/bin/bash

# This script is used to backup PostgreSQL instances and push the backup into an S3 compatible bucket.
set -e

# The time where the backup is executed.
# Format : DD-MM-YYYY-HH:mm:ss
TIME=`date +%d%m%Y-%H-%M`

# The S3 bucket where backup will be stored.
# By default, this is "ioterop-mongodb-backup"
S3_BUCKET=${S3_BUCKET:-postgres-backup}

# The name of the SQL file which will be dumped by the script
SQL_OUTPUT_FILE="backup.sql"

# The name of the tar file which will be created
TAR_FILE="backup-$TIME.tar.gz"

# Default region for AWS CLI
AWS_DEFAULT_REGION=us-east-1

# Check if variables required by this script are defined in environment
if [ -z $AWS_ACCESS_KEY_ID ] || [ -z $AWS_SECRET_ACCESS_KEY ] || [ -z $POSTGRES_URL ] || [ -z $S3_ENDPOINT ]; then
    echo "[ERROR] : Detected that your environment does not contain all variables required by the script. Please check if AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_ID and POSTGRES_URL, and S3_ENDPOINT are defined."
    exit 1
fi

# Extract the password from the postgres URL
export PGPASSWORD=$(echo "$POSTGRES_URL" | cut -d"@" -f 1 | cut -d":" -f3)

# Extract the DB from the postgres URL
PG_DATABASE=$(echo "$POSTGRES_URL" | cut -d":" -f 4 | cut -d"/" -f 2)

echo "Dumping database $PG_DATABASE"

# Dump the database into a script
pg_dumpall -d "$POSTGRES_URL" --inserts --rows-per-insert=100 -l "$(printf '%s' "$PG_DATABASE")" > $SQL_OUTPUT_FILE

# Compress the backup
tar -zvcf $TAR_FILE $SQL_OUTPUT_FILE

# Finally copy our file
aws --endpoint-url "http://$S3_ENDPOINT" s3 cp $TAR_FILE "s3://$S3_BUCKET"
