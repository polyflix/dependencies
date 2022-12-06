#!/bin/bash


function check_connectivity_and_set_alias {
   result=$(mc alias set minio ${MINIO_HOST} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD} 2>&1)

   if [ "$?" -ne "0" ]; then
      return 1
   fi

   return 0
}

function create_notify_event {
   local BUCKET_NAME="${1}"
   local EVENT_TRIGGER="${2}"
   echo "Creating event on bucket ${BUCKET_NAME}"

  local EXISTS=$(mc event list minio/${BUCKET_NAME} | wc -l | tr -d " ")
  if [ $EXISTS -eq 1 ]; then
    echo "Event already exists, no need to create it"
  else
    echo "RUN mc event add minio/${BUCKET_NAME} arn:minio:sqs::PRIMARY:kafka --event ${EVENT_TRIGGER}"
    mc event add minio/${BUCKET_NAME} arn:minio:sqs::PRIMARY:kafka --event ${EVENT_TRIGGER}
  fi
 }

function create_bucket {
  local BUCKET_NAME="${1}"
  echo "Creating bucket ${BUCKET_NAME}"

  local EXISTS=$(bucket_exists ${BUCKET_NAME})
  if [ $EXISTS -eq 1 ]; then
    echo "Bucket already exist"
  else
    mc mb minio/${BUCKET_NAME}
  fi

  if [[ "${2}" -eq "" ]]; then
    mc policy set download minio/${BUCKET_NAME}
  else
    mc policy set "${2}" minio/${BUCKET_NAME}
  fi
}

function bucket_exists {
  local BUCKET_NAME="${1}"

  local lines=$(mc tree minio | grep ${BUCKET_NAME} | wc -l | tr -d " ")
  echo $lines
}

function main() {
  until check_connectivity_and_set_alias
  do
    echo "Waiting for MinIO to be up and running"
    sleep 1
  done

  create_bucket videos
  create_bucket images
  create_bucket subtitles
  create_bucket attachments

  create_notify_event videos put
  create_notify_event attachments put
}

main
