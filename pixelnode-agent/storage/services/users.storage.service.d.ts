import { Repository } from "typeorm";
import { Users } from "../entities/users.entity";
export declare class UsersStorageService {
    private usersRepository;
    constructor(usersRepository: Repository<Users>);
    findOneByRole(role: string): Promise<Users>;
    findOneByUsername(username: string): Promise<Users>;
    save(username: string, password: string): Promise<Users>;
}
