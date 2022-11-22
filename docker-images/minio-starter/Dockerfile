FROM minio/mc

ENV MINIO_ROOT_USER=minio
ENV MINIO_ROOT_PASSWORD=minio123
ENV MINIO_HOST=minio

COPY ./entrypoint.sh /docker-entrypoint.d/entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.d/entrypoint.sh"]
