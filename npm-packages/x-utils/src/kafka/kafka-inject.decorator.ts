import { Inject } from "@nestjs/common";

export const KAFKA_CLIENT = "KAFKA_CLIENT";

export const InjectKafkaClient = () => {
  return Inject(KAFKA_CLIENT);
};
