import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    Configuration,
    MetadataApiFactory,
    MetadataApiInterface,
    ReadApiFactory,
    ReadApiInterface,
    SubjectSet,
    WriteApiFactory,
    WriteApiInterface
} from "@ory/keto-client";
import { Namespace } from "./keto/namespaces";
import { AuthorizationError } from "./authz.error";
import { AxiosRequestConfig } from "axios";
import { Role } from "../types";

export interface AuthorizationServiceConfig {
    read_address: string;
    write_address?: string;
    api_key?: string;
}

@Injectable()
export class AuthorizationService {
    private readonly logger = new Logger(AuthorizationService.name);

    private readonly readApi: ReadApiInterface;

    private readonly writeApi: WriteApiInterface;

    private readonly metadataApi: MetadataApiInterface;

    constructor(cfgSvc: AuthorizationServiceConfig) {
        const readConfig = new Configuration({
            basePath: cfgSvc.read_address,
            apiKey: cfgSvc.api_key,
            baseOptions: {
                headers: {
                    Authorization: `Bearer ${cfgSvc.api_key}`
                }
            }
        });
        const writeConfig = new Configuration({
            ...readConfig,
            basePath: cfgSvc.write_address
        });
        this.readApi = ReadApiFactory(readConfig);
        this.writeApi = WriteApiFactory(writeConfig);
        this.metadataApi = MetadataApiFactory(readConfig);
        this.isHealthy();
    }

    private async canId(
        namespace: string,
        object: string,
        relation: string,
        subjectId: string,
        maxDepth?: number,
        options?: AxiosRequestConfig
    ): Promise<boolean> {
        const tuple_str = `${subjectId} -> ${namespace}:${object}:${relation}`;
        this.logger.debug(`can(), ${tuple_str}`);
        return this.readApi
            .getCheck(
                namespace,
                object,
                relation,
                subjectId,
                undefined,
                undefined,
                undefined,
                maxDepth,
                options
            )
            .then((res) => {
                this.logger.debug(`can(), ${tuple_str} => ${res.data.allowed}`);
                return res.data.allowed;
            })
            .catch((err) => {
                this.logger.error(`can(), ${tuple_str} => ${err}`);
                return false;
            });
    }

    private async canSet(
        namespace: string,
        object: string,
        relation: string,
        subjectSet?: SubjectSet,
        maxDepth?: number,
        options?: AxiosRequestConfig
    ): Promise<boolean> {
        const tuple_str = `${subjectSet.namespace}:${subjectSet.object}#${subjectSet.relation} -> ${namespace}:${object}#${relation}`;
        this.logger.debug(`can(), ${tuple_str}`);
        return this.readApi
            .getCheck(
                namespace,
                object,
                relation,
                undefined,
                subjectSet.namespace,
                subjectSet.object,
                subjectSet.relation,
                maxDepth,
                options
            )
            .then((res) => {
                this.logger.debug(`can(), ${tuple_str} => ${res.data.allowed}`);
                return res.data.allowed;
            })
            .catch((err) => {
                this.logger.error(`can(), ${tuple_str} => ${err}`);
                return false;
            });
    }

    async canViewVideo(userId: string, videoId: string): Promise<boolean> {
        return Promise.all([
            this.canSet(Namespace.Video, videoId, "view", {
                namespace: Namespace.User,
                object: userId,
                relation: "manager"
            }),
            this.canId(Namespace.Video, videoId, "view", "*")
        ]).then(([canView, canDoAnything]) => canView || canDoAnything);
    }

    async writeOwnerToVideo(userId: string, videoId: string): Promise<void> {
        const tuple = {
            namespace: Namespace.Video,
            object: videoId,
            relation: "owners",
            subject_set: {
                namespace: Namespace.User,
                object: userId,
                relation: "manager"
            }
        };
        this.logger.debug(
            `writeOwnerToVideo(), tuple: ${JSON.stringify(tuple)}`
        );
        this.writeApi.createRelationTuple(tuple).catch((err) => {
            this.logger.error(
                `Could not set video (${videoId}) owner to user (${userId}), error: ${err}`
            );
            throw new AuthorizationError("Failed to set video owner");
        });
    }

    async writeOwnerRoleToVideo(role: Role, videoId: string): Promise<void> {
        const tuple = {
            namespace: Namespace.Video,
            object: videoId,
            relation: "owners",
            subject_set: {
                namespace: Namespace.Role,
                object: role,
                relation: "members"
            }
        };
        this.logger.debug(
            `writeOwnerRoleToVideo(), tuple: ${JSON.stringify(tuple)}`
        );
        this.writeApi.createRelationTuple(tuple).catch((err) => {
            this.logger.error(
                `Could not set video (${videoId}) owner to role (${role}), error: ${err}`
            );
            throw new AuthorizationError("Failed to add role owner to video");
        });
    }

    async setVideoPublic(videoId: string): Promise<void> {
        const tuple = {
            namespace: Namespace.Video,
            object: videoId,
            relation: "viewers",
            subject_id: "*"
        };
        this.writeApi
            .createRelationTuple(tuple)
            .then((res) => {
                this.logger.log(`Video (${videoId}) is now public`);
                this.logger.debug(
                    `setVideoPublic(), tuple: ${JSON.stringify(tuple)}`
                );
            })
            .catch((err) => {
                this.logger.error(
                    `Could not set video (${videoId}) to public, error: ${err}`
                );
                throw new AuthorizationError(
                    "Failed to define video as public"
                );
            });
    }

    async setVideoPrivate(videoId: string): Promise<void> {
        this.writeApi
            .deleteRelationTuples(Namespace.Video, videoId, "viewers", "*")
            .then((res) => {
                this.logger.log(`Video (${videoId}) is now private`);
            })
            .catch((err) => {
                this.logger.error(
                    `Could not set video (${videoId}) to public, error: ${err}`
                );
                throw new AuthorizationError(
                    "Failed to define video as public"
                );
            });
    }

    private async isHealthy(): Promise<boolean> {
        return this.metadataApi
            .isReady()
            .then(() => true)
            .catch((err) => {
                this.logger.error(
                    `Authorization server is not healthy: ${err}`
                );
                return false;
            });
    }
}
