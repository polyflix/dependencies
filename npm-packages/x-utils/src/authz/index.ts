import { ConfigService } from "@nestjs/config";
import { AuthorizationServiceConfig } from "./authz.service";

export * from "./authz.service";
export * from "./authz.module";
export * from "./authz.error";
export * from "./authz.types";

export const configureAuthZService = (
    cfgSvc: ConfigService
): AuthorizationServiceConfig => {
    const getOrThrow = <T>(key: string): T => {
        const value = cfgSvc.get<T>(key);
        if (value === undefined) {
            throw new Error(`Missing configuration key: ${key}`);
        }
        return value;
    };

    return {
        read_address: getOrThrow("authorization.read"),
        write_address: cfgSvc.get("authorization.write"),
        api_key: cfgSvc.get("authorization.apikey")
    };
};
