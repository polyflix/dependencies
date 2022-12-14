import { KafkaOptions, Transport } from "@nestjs/microservices";

export const kafkaConfig = (config): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: config["client"]["clientId"],
      brokers: config["client"]["brokers"].split(","),
    },
    consumer: {
      groupId: config["consumer"]["groupId"],
      allowAutoTopicCreation: config["consumer"]["allowAutoTopicCreation"],
    },
  },
});
