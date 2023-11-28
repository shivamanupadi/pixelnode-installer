import { AlgodParams, InstallParams, NodeStatus, NodeVariant, OsParams, PrerequisitesParams, RestartPortalParams, StartParams, StopParams, UpdateNodeParams, UpdatePortalParams } from "../models/types";
import { Request } from "express";
import { AuthService } from "../../auth/services/auth.service";
import { NodeService } from "../services/node.service";
import { Dockerstats } from "dockerstats";
import DockerContainerStatsData = Dockerstats.DockerContainerStatsData;
import { KeysStorageService } from "../../storage/services/keys.storage.service";
import { UsersStorageService } from "../../storage/services/users.storage.service";
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class ApiController {
    private authService;
    private nodeService;
    private keysStorageService;
    private usersStorageService;
    constructor(authService: AuthService, nodeService: NodeService, keysStorageService: KeysStorageService, usersStorageService: UsersStorageService);
    ping(): void;
    os(): Promise<OsParams>;
    fileExists(path: string): Promise<boolean>;
    prerequisites(): Promise<PrerequisitesParams>;
    install(payload: {
        nodeVariantId: string;
    }): Promise<InstallParams>;
    start(): Promise<StartParams>;
    catchup(): Promise<void>;
    stop(): Promise<StopParams>;
    participationKeys(body: any): Promise<string>;
    getNodeVariants(): NodeVariant[];
    algod(req: Request): Promise<AlgodParams>;
    status(req: Request): Promise<NodeStatus>;
    setup(): Promise<any>;
    nodeStats(): Promise<DockerContainerStatsData>;
    reset(): Promise<boolean>;
    updateNode(): Promise<UpdateNodeParams>;
    updatePortal(): Promise<UpdatePortalParams>;
    restartPortal(): Promise<RestartPortalParams>;
    execCommand(command: string): Promise<unknown>;
}
