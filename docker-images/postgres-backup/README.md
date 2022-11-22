# PostgreSQL backup image

This folder contains a secured minimal image to run a PostgreSQL backup script. This script will backup your PostgreSQL instance, and upload the backup into an S3 bucket or any S3 compatible endpoint.

## Configuration

This image can be configured with the following environment variables :

- `AWS_ACCESS_KEY_ID` **(required)** : Your AWS access key id
- `AWS_SECRET_ACCESS_KEY` **(required)** : Your AWS secret access key
- `POSTGRES_URL` **(required)** : Your PostgreSQL url in the following format : `postgres://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>`
- `S3_ENDPOINT` **(required)** : Your S3 compatible endpoint
- `S3_BUCKET` : The bucket name where you want to save the backup. By default, this is `postgres-backup`

## How to use this image

Run the following command to backup a postgreSQL instance (`postgres://localhost:5432/mydb`) and push the backup into the bucket `example-bucket` :

```bash
$ docker run -e AWS_ACCESS_KEY_ID=<YOUR_KEY> -e AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_KEY> -e
S3_BUCKET=example-bucket -e S3_ENDPOINT=<YOUR_ENDPOINT> -e POSTGRES_URL=postgres://localhost:5432/mydb gitlab.polytech.umontpellier.fr:5050/postgres-backup:latest
```
