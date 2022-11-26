#!/bin/sh
# We apply environment variables provided by secrets into ormconfig.json
cat ormconfig.json.tpml | envsubst > ormconfig.json

# Actually run the migrations
npx typeorm migration:run
