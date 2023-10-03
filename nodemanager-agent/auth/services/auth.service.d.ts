import { JwtService } from "@nestjs/jwt";
import { UsersStorageService } from "../../storage/services/users.storage.service";
export declare class AuthService {
    private jwtService;
    private usersStorageService;
    constructor(jwtService: JwtService, usersStorageService: UsersStorageService);
    cryptPassword(password: string): Promise<string>;
    compareHash(password: string, hash: string): Promise<boolean>;
    createJWToken(data: any): Promise<string>;
    verifyJWToken(token: any): Promise<any>;
    isSetupCompleted(): Promise<boolean>;
}
