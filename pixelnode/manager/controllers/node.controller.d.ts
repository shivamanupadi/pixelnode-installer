import { AlgodParams, NodeEnv, NodeStatus, NodeVariant, TelemetryConfig } from "../models/types";
import { Request } from "express";
import { NodeService } from "../services/node.service";
import { Dockerstats } from "dockerstats";
import { KeysStorageService } from "../../storage/services/keys.storage.service";
import DockerContainerStatsData = Dockerstats.DockerContainerStatsData;
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class NodeController {
    private nodeService;
    private keysStorageService;
    constructor(nodeService: NodeService, keysStorageService: KeysStorageService);
    install(payload: {
        nodeVariantId: string;
    }): Promise<boolean>;
    restart(): Promise<boolean>;
    catchup(): Promise<void>;
    setMetrics(body: any): Promise<boolean>;
    getMetrics(): Promise<boolean>;
    getTelemetry(): Promise<boolean>;
    getTelemetryConfig(): Promise<TelemetryConfig>;
    setTelemetry(body: any): Promise<boolean>;
    setTelemetryName(body: any): Promise<boolean>;
    getNodeVariants(): NodeVariant[];
    algod(req: Request): Promise<AlgodParams>;
    status(req: Request): Promise<NodeStatus>;
    nodeStats(): Promise<DockerContainerStatsData>;
    uninstall(): Promise<boolean>;
    updateNode(): Promise<boolean>;
    getNodeEnv(): Promise<NodeEnv>;
}
