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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const users_storage_service_1 = require("../../storage/services/users.storage.service");
const is_empty_1 = __importDefault(require("is-empty"));
let AuthService = class AuthService {
    constructor(jwtService, usersStorageService) {
        this.jwtService = jwtService;
        this.usersStorageService = usersStorageService;
    }
    async cryptPassword(password) {
        return await bcryptjs_1.default.hash(password, 8);
    }
    async compareHash(password, hash) {
        return await bcryptjs_1.default.compare(password, hash);
    }
    async createJWToken(data) {
        return await this.jwtService.signAsync(data);
    }
    async verifyJWToken(token) {
        return await this.jwtService.verifyAsync(token);
    }
    async isSetupCompleted() {
        const user = await this.usersStorageService.findOneByRole("admin");
        return !(0, is_empty_1.default)(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_storage_service_1.UsersStorageService])
], AuthService);
//# sourceMappingURL=auth.service.js.map