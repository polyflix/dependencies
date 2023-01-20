import { DynamicModule, Logger, Module } from "@nestjs/common";
import {
    AuthorizationService,
    AuthorizationServiceConfig
} from "./authz.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configureAuthZService } from "./index";
import { ModuleMetadata } from "@nestjs/common/interfaces";

export interface AuthorizationModuleOptions
    extends Pick<ModuleMetadata, "imports"> {
    inject?: any[];
    useFactory: (
        ...args: any[]
    ) => Promise<AuthorizationService> | AuthorizationService;
}

@Module({})
export class AuthorizationModule {
    private static readonly logger = new Logger(AuthorizationModule.name);
    static register(options: AuthorizationModuleOptions): DynamicModule {
        return {
            module: AuthorizationModule,
            imports: options.imports,
            providers: [
                {
                    provide: AuthorizationService,
                    useFactory: options.useFactory,
                    inject: options.inject || []
                }
            ],
            exports: [AuthorizationService]
        };
    }
}
