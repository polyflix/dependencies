# X Utils

## Install

Install the package with the following command :

```
npm i @polyflix/x-utils
```

## How to use

This module expose some utilities

### Decorators

Get user roles

```ts
 get(@IsAdmin(): isAdmin: boolean) {}

 get(@MeRoles(): roles: Role[]) {}

 get(@MeRoles("Admin"): roles: Role[]) {}
```

Get user id

```ts
 get(@MeId(): me: string) {}
```

### Guards

Allow only specific roles on a route

```ts
@Roles(Role.Admin, Role.Contributor)
```

### Kafka

Create kafka modules

```ts
@Global()
@Module({
    imports: [
        KafkaModule.register({
            useFactory: (configService: ConfigService) => {
                return kafkaConfig(configService.get("kafka"));
            },
            inject: [ConfigService]
        })
    ],
    exports: [KafkaModule]
})
```

Use kafka client

```ts
constructor(
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka,
) {}
```

Kafka message

```ts
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


this.kafkaClient.emit<string, PolyflixKafkaMessage>(topic, {
  key: video.slug,
  value: {
    trigger: TriggerType.PROCESSING,
    payload: video
  },
});


@EventPattern("polyflix.legacy.video")
video(@Payload("value") message: PolyflixKafkaValue) {
  // TODO
}
```

### MinIO

`MinIoMessageValue` match to the payload of an MinIO event in kafka

```ts
@EventPattern("minio.upload")
async process(@Payload("value") message: MinIOMessageValue) { }
```
