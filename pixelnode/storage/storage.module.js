"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const keys_entity_1 = require("./entities/keys.entity");
const keys_storage_service_1 = require("./services/keys.storage.service");
const users_storage_service_1 = require("./services/users.storage.service");
const users_entity_1 = require("./entities/users.entity");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([keys_entity_1.Keys, users_entity_1.Users])],
        controllers: [],
        providers: [keys_storage_service_1.KeysStorageService, users_storage_service_1.UsersStorageService],
        exports: [keys_storage_service_1.KeysStorageService, users_storage_service_1.UsersStorageService],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map