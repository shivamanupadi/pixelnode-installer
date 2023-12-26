import { KeysStorageService } from "../../storage/services/keys.storage.service";
import { Keys } from "../../storage/entities/keys.entity";
import { NodeVariant } from "../models/types";
export declare class NodeService {
    private keysStorageService;
    constructor(keysStorageService: KeysStorageService);
    isValidNodeVariant(id: string): boolean;
    getInstalledNodeVariantId(): Promise<string>;
    getInstalledNodeVariant(): Promise<NodeVariant>;
    setNodeVariant(nodeVariant: string): Promise<Keys>;
    isInstalled(): Promise<boolean>;
    getNodeDockerComposeFile(): Promise<string>;
    getDockerComposeFileByNodeVariant(id: string): string;
    getCatchPointUrl(): Promise<string>;
    getNodeVariants(): NodeVariant[];
    getNodeVariant(id: string): NodeVariant;
    getCatchPoint(): Promise<string>;
}
