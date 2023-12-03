import { AuthService } from "../../auth/services/auth.service";
import { NodeService } from "../services/node.service";
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class PortalController {
    private authService;
    private nodeService;
    constructor(authService: AuthService, nodeService: NodeService);
    setup(): Promise<boolean>;
    update(): Promise<boolean>;
    restart(): Promise<boolean>;
    execCommand(command: string): Promise<unknown>;
}
