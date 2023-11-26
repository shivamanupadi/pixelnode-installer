import { DeleteResult, Repository } from "typeorm";
import { Keys } from "../entities/keys.entity";
export declare class KeysStorageService {
    private keysRepository;
    constructor(keysRepository: Repository<Keys>);
    find(key: string): Promise<Keys>;
    delete(key: string): Promise<DeleteResult>;
    save(key: string, value: string): Promise<Keys>;
}
