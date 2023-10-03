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
exports.KeysStorageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const keys_entity_1 = require("../../auth/entities/keys.entity");
const typeorm_2 = require("@nestjs/typeorm");
let KeysStorageService = class KeysStorageService {
    constructor(keysRepository) {
        this.keysRepository = keysRepository;
    }
    async find(key) {
        return await this.keysRepository.findOne({ where: { key } });
    }
    async createMany(rows) {
        return await this.keysRepository.save(rows.map((row) => {
            return this.keysRepository.create(row);
        }));
    }
    async save(key, value) {
        return await this.keysRepository.save({ key, value });
    }
};
exports.KeysStorageService = KeysStorageService;
exports.KeysStorageService = KeysStorageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(keys_entity_1.Keys)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], KeysStorageService);
//# sourceMappingURL=keys.storage.service.js.map