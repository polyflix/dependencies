import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";
import { ClientProxyFactory, KafkaOptions } from "@nestjs/microservices";
import { KAFKA_CLIENT } from "./kafka-inject.decorator";
import { ConfigService } from "@nestjs/config";

export interface KafkaModuleOptions {
  inject?: any[];
  useFactory?: (...args: any[]) => any;
}

@Module({})
export class KafkaModule {
  static register(config: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KAFKA_CLIENT,
          useFactory: config.useFactory,
          inject: config.inject,
        },
      ],
      exports: [KAFKA_CLIENT],
    };
  }
}
