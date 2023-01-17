import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Configuration,
  ReadApiFactory,
  ReadApiInterface,
} from "@ory/keto-client";

export interface AuthorizationServiceConfig {
  read_address: string;
  write_address?: string;
  api_key?: string;
}

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  private readonly readApi: ReadApiInterface;

  constructor(cfgSvc: AuthorizationServiceConfig) {
    const config = new Configuration({
      basePath: cfgSvc.read_address,
      apiKey: cfgSvc.api_key,
      baseOptions: {
        headers: {
          Authorization: `Bearer ${cfgSvc.api_key}`,
        },
      },
    });
    this.readApi = ReadApiFactory(config);
    this.isHealthy();
    this.canViewVideo("mySubject", "test");
    this.canCreateVideo("mySubject");
  }

  private async can(
    namespace: string,
    object: string,
    relation: string,
    subject: string
  ): Promise<boolean> {
    return this.readApi
      .getCheck(namespace, object, relation, subject)
      .then((res) => {
        this.logger.debug(
          `Requested access to video (${object}) for subject (${subject}), result: ${res.data.allowed}`
        );
        return res.data.allowed;
      })
      .catch((err) => {
        this.logger.error(
          `Could not check access to video (${object}) for subject (${subject}), error: ${err}`
        );
        return false;
      });
  }

  async canVideo(
    relation: string,
    userId: string,
    videoId: string
  ): Promise<boolean> {
    return this.can("Video", videoId, relation, userId);
  }

  async canViewVideo(userId: string, videoId: string): Promise<boolean> {
    return this.canVideo("view", userId, videoId);
  }

  async canCreateVideo(userId: string): Promise<boolean> {
    return this.can("Role", "admin", "member", userId);
  }

  private async isHealthy(): Promise<boolean> {
    const response = await this.readApi.getCheck(
      "User",
      "test",
      "test",
      "test"
    );

    if (response.status !== 200) {
      this.logger.error(
        `AuthorizationService is not healthy (http ${response.status}): ${response.data}`
      );
    } else {
      this.logger.log(`AuthorizationService is up & running`);
    }

    return response.status === 200;
  }

  /**
   * Use the config service to load pre-defined configuration format
   * It will throw if the configuration is not valid
   */
  static fromConfigService(cfgSvc: ConfigService): AuthorizationService {
    const getOrThrow = <T>(key: string): T => {
      const value = cfgSvc.get<T>(key);
      if (value === undefined) {
        throw new Error(`Missing configuration key: ${key}`);
      }
      return value;
    };

    return new AuthorizationService({
      read_address: getOrThrow("authorization.read_address"),
      write_address: cfgSvc.get("authorization.write_address"),
      api_key: cfgSvc.get("authorization.api_key"),
    });
  }
}
