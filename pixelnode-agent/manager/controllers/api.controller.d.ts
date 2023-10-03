import { AlgodParams, NodeStatus, OsParams, PrerequisitesParams, StartParams, StopParams } from "../models/types";
import { Request } from "express";
import { AuthService } from "../../auth/services/auth.service";
import { NodeService } from "../services/node.service";
import { Dockerstats } from "dockerstats";
import DockerContainerStatsData = Dockerstats.DockerContainerStatsData;
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class ApiController {
    private authService;
    private nodeService;
    constructor(authService: AuthService, nodeService: NodeService);
    ping(): void;
    os(): Promise<OsParams>;
    fileExists(path: string): Promise<boolean>;
    prerequisites(): Promise<PrerequisitesParams>;
    start(): Promise<StartParams>;
    catchup(): Promise<void>;
    stop(): Promise<StopParams>;
    participationKeys(body: any): Promise<string>;
    algod(req: Request): Promise<AlgodParams>;
    status(req: Request): Promise<NodeStatus>;
    setup(): Promise<any>;
    nodeStats(): Promise<DockerContainerStatsData>;
}
