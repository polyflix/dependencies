FROM debian:stable-slim

RUN apt-get -qq update -y && apt-get -qq install -y --no-install-recommends gnupg curl wget unzip ca-certificates lsb-release \
    && echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt-get update -y \
    && apt-get -y install postgresql-client-13 \
    && rm -rf /var/lib/apt/lists/* \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && addgroup -gid 1000 dopolytech \
    && adduser -q --disabled-password --uid 1000 --gid 1000 dopolytech

USER dopolytech

WORKDIR /home/dopolytech

COPY --chown=dopolytech:dopolytech ./entrypoint.sh ./

ENTRYPOINT [ "./entrypoint.sh" ]

