"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const manager_module_1 = require("./manager/manager.module");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const keys_entity_1 = require("./auth/entities/keys.entity");
const storage_module_1 = require("./storage/storage.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const path_1 = __importDefault(require("path"));
const serve_static_1 = require("@nestjs/serve-static");
const users_entity_1 = require("./auth/entities/users.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.default.join(__dirname, "nodemanager-web"),
                exclude: ["/api/(.*)", "/auth/(.*)"],
            }),
            cache_manager_1.CacheModule.register({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "sqlite",
                database: "db",
                entities: [keys_entity_1.Keys, users_entity_1.Users],
                synchronize: true,
            }),
            storage_module_1.StorageModule,
            manager_module_1.ManagerModule,
            auth_module_1.AuthModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map