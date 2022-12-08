FROM minio/mc:RELEASE.2022-04-01T23-44-48Z

ENV MINIO_ROOT_USER=minio
ENV MINIO_ROOT_PASSWORD=minio123
ENV MINIO_HOST=http://minio:9000

COPY ./entrypoint.sh /docker-entrypoint.d/entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.d/entrypoint.sh"]
