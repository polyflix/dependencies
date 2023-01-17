import { DynamicModule, Global, Module } from "@nestjs/common";
import { AuthorizationService } from "./authz.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

export interface AuthorizationModuleOptions {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<DynamicModule> | DynamicModule;
}

@Module({
  providers: [
    ConfigService,
    {
      inject: [ConfigService],
      useFactory: AuthorizationService.fromConfigService,
      provide: AuthorizationService,
    },
  ],
  imports: [ConfigModule],
  exports: [AuthorizationService],
})
export class AuthorizationModule {
  static register(): DynamicModule {
    return {
      module: AuthorizationModule,
      providers: [
        ConfigService,
        {
          inject: [ConfigService],
          useFactory: AuthorizationService.fromConfigService,
          provide: AuthorizationService,
        },
      ],
      imports: [ConfigModule],
      exports: [AuthorizationService],
    };
  }
}
