FROM node:14-alpine

RUN npm install -g typeorm@0.2.45 pg@8.7.3 typescript
RUN npm install dotenv@10.0.0
RUN apk add --no-cache gettext

WORKDIR /migrations

COPY ./ormconfig.json.tpml ormconfig.json.tpml
COPY ./entrypoint.sh entrypoint.sh

RUN chmod 766 entrypoint.sh

ENTRYPOINT [ "/migrations/entrypoint.sh" ]

# This line should be added into your service image
# The reason we are using tsc manually is because webpack doesn't transpile migrations as they are not part of the project :clown:
# So we have to do it ourselves

# COPY ./dist/resources/migrations migrations
# RUN tsc --skipLibCheck true --skipDefaultLibCheck true  ./migrations/*.ts  --outDir "./migrations" || echo "expected error"

