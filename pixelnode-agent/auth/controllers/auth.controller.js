"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const check_password_strength_1 = require("check-password-strength");
const users_storage_service_1 = require("../../storage/services/users.storage.service");
let AuthController = class AuthController {
    constructor(authService, usersStorageService) {
        this.authService = authService;
        this.usersStorageService = usersStorageService;
    }
    async login(payload) {
        const setupCompleted = await this.authService.isSetupCompleted();
        if (!setupCompleted) {
            throw new common_1.HttpException("setup incomplete", common_1.HttpStatus.BAD_REQUEST);
        }
        const { username, password } = payload;
        if (!username) {
            throw new common_1.HttpException("missing username", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!password) {
            throw new common_1.HttpException("missing password", common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersStorageService.findOneByUsername(username);
        if (!user) {
            throw new common_1.HttpException("user not found", common_1.HttpStatus.UNAUTHORIZED);
        }
        const passHash = user.password;
        const valid = await this.authService.compareHash(password, passHash);
        if (!valid) {
            throw new common_1.HttpException("invalid credentials", common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = await this.authService.createJWToken({
            username: user.username,
        });
        return {
            token,
        };
    }
    async setup(payload) {
        const setupCompleted = await this.authService.isSetupCompleted();
        if (setupCompleted) {
            throw new common_1.HttpException("setup already completed", common_1.HttpStatus.BAD_REQUEST);
        }
        const { username, password } = payload;
        if (!username) {
            throw new common_1.HttpException("invalid username", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!password) {
            throw new common_1.HttpException("invalid password", common_1.HttpStatus.BAD_REQUEST);
        }
        if ((0, check_password_strength_1.passwordStrength)(password).id < 3) {
            throw new common_1.HttpException("weak password", common_1.HttpStatus.BAD_REQUEST);
        }
        const passHash = await this.authService.cryptPassword(password);
        await this.usersStorageService.save(username, passHash);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("setup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setup", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_storage_service_1.UsersStorageService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map