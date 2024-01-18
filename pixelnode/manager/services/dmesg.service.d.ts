export declare class DmesgService {
    getLogs(): Promise<string>;
    execCommand(command: string): Promise<string>;
}
