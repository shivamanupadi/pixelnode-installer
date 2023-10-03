import { Repository } from "typeorm";
import { Keys } from "../../auth/entities/keys.entity";
export declare class KeysStorageService {
    private keysRepository;
    constructor(keysRepository: Repository<Keys>);
    find(key: string): Promise<Keys>;
    createMany(rows: {
        key: string;
        value: string;
    }[]): Promise<Keys[]>;
    save(key: string, value: string): Promise<Keys>;
}
