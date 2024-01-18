import { DmesgService } from "../services/dmesg.service";
import { Pm2Service } from "../services/pm2.service";
export declare const Scopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class LogsController {
    private dmesgService;
    private pm2Service;
    constructor(dmesgService: DmesgService, pm2Service: Pm2Service);
    dmesg(): Promise<string>;
    pm2(type: string): Promise<string>;
}
