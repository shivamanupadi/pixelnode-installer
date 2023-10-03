import { AuthService } from "../services/auth.service";
import { UsersStorageService } from "../../storage/services/users.storage.service";
export declare class AuthController {
    private authService;
    private usersStorageService;
    constructor(authService: AuthService, usersStorageService: UsersStorageService);
    login(payload: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
    setup(payload: {
        username: string;
        password: string;
    }): Promise<void>;
}
