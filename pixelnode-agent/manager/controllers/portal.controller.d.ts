import { AuthService } from "../../auth/services/auth.service";
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class PortalController {
    private authService;
    constructor(authService: AuthService);
    setup(): Promise<boolean>;
    update(): Promise<boolean>;
    restart(): Promise<boolean>;
    execCommand(command: string): Promise<unknown>;
}
