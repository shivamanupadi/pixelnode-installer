import { AuthService } from "../../auth/services/auth.service";
import { NodeService } from "../services/node.service";
import { KeysStorageService } from "../../storage/services/keys.storage.service";
import { UsersStorageService } from "../../storage/services/users.storage.service";
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class PortalController {
    private authService;
    private nodeService;
    private keysStorageService;
    private usersStorageService;
    constructor(authService: AuthService, nodeService: NodeService, keysStorageService: KeysStorageService, usersStorageService: UsersStorageService);
    setup(): Promise<boolean>;
    update(): Promise<boolean>;
    restart(): Promise<boolean>;
    factoryReset(): Promise<boolean>;
    execCommand(command: string): Promise<unknown>;
}
