import { TriggerType } from "./kafka-trigger.type";

export interface PolyflixKafkaMessage {
  key: string;
  value: {
    trigger: TriggerType;
    payload: any;
  };
}

export interface PolyflixKafkaValue {
  trigger: TriggerType;
  payload: any;
}
