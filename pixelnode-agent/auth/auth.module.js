"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_service_1 = require("./services/auth.service");
const storage_module_1 = require("../storage/storage.module");
const jwt_1 = require("@nestjs/jwt");
const keys_storage_service_1 = require("../storage/services/keys.storage.service");
const crypto_1 = require("crypto");
const auth_gaurd_1 = require("./services/auth.gaurd");
const core_1 = require("@nestjs/core");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            storage_module_1.StorageModule,
            jwt_1.JwtModule.registerAsync({
                imports: [storage_module_1.StorageModule],
                inject: [keys_storage_service_1.KeysStorageService],
                useFactory: async (keysStorageService) => {
                    const secret = await keysStorageService.find("jwt_secret");
                    let jwtSecret = "";
                    if (secret) {
                        jwtSecret = secret.value;
                    }
                    else {
                        jwtSecret = (0, crypto_1.randomBytes)(64).toString("hex");
                        await keysStorageService.save("jwt_secret", jwtSecret);
                    }
                    return {
                        secret: jwtSecret,
                        signOptions: {
                            expiresIn: "100000s",
                        },
                    };
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_gaurd_1.AuthGuard,
            },
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map