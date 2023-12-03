import { AlgodParams, NodeStatus, NodeVariant } from "../models/types";
import { Request } from "express";
import { NodeService } from "../services/node.service";
import { Dockerstats } from "dockerstats";
import DockerContainerStatsData = Dockerstats.DockerContainerStatsData;
import { KeysStorageService } from "../../storage/services/keys.storage.service";
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
    participationKeys(body: any): Promise<string>;
    getNodeVariants(): NodeVariant[];
    algod(req: Request): Promise<AlgodParams>;
    status(req: Request): Promise<NodeStatus>;
    nodeStats(): Promise<DockerContainerStatsData>;
    uninstall(): Promise<boolean>;
    updateNode(): Promise<boolean>;
    updatePortal(): Promise<boolean>;
    restartPortal(): Promise<boolean>;
    execCommand(command: string): Promise<unknown>;
}
