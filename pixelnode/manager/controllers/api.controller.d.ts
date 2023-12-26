import { OsParams, PrerequisitesParams } from "../models/types";
import { NodeService } from "../services/node.service";
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class ApiController {
    private nodeService;
    constructor(nodeService: NodeService);
    ping(): void;
    os(): Promise<OsParams>;
    prerequisites(): Promise<PrerequisitesParams>;
}
