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
exports.NodeService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const keys_storage_service_1 = require("../../storage/services/keys.storage.service");
const constants_1 = require("../../constants");
let NodeService = class NodeService {
    constructor(keysStorageService) {
        this.keysStorageService = keysStorageService;
    }
    isValidNodeVariant(id) {
        const nodeVariant = this.getNodeVariant(id);
        return Boolean(nodeVariant);
    }
    async getInstalledNodeVariant() {
        const nodeVariantRecord = await this.keysStorageService.find(constants_1.KEYS_STORAGE.NODE_VARIANT);
        return nodeVariantRecord?.value;
    }
    async setNodeVariant(nodeVariant) {
        return await this.keysStorageService.save(constants_1.KEYS_STORAGE.NODE_VARIANT, nodeVariant);
    }
    async isInstalled() {
        const nodeVariant = await this.getInstalledNodeVariant();
        return Boolean(nodeVariant);
    }
    async getNodeDockerComposeFile() {
        const nodeVariant = await this.getInstalledNodeVariant();
        return this.getDockerComposeFileByNodeVariant(nodeVariant);
    }
    getDockerComposeFileByNodeVariant(id) {
        const nodeVariant = this.getNodeVariant(id);
        return nodeVariant.dockerComposeFile;
    }
    async getCatchPointUrl() {
        const nodeVariantId = await this.getInstalledNodeVariant();
        const nodeVariant = this.getNodeVariant(nodeVariantId);
        return nodeVariant.catchup;
    }
    getNodeVariants() {
        return [
            {
                id: "algorand_mainnet",
                name: "Algorand mainnet",
                dockerComposeFile: "docker-compose.algorand.mainnet.yml",
                catchup: "https://algorand-catchpoints.s3.us-east-2.amazonaws.com/channel/mainnet/latest.catchpoint",
            },
            {
                id: "algorand_testnet",
                name: "Algorand testnet",
                dockerComposeFile: "docker-compose.algorand.testnet.yml",
                catchup: "https://algorand-catchpoints.s3.us-east-2.amazonaws.com/channel/testnet/latest.catchpoint",
            },
            {
                id: "algorand_betanet",
                name: "Algorand betanet",
                dockerComposeFile: "docker-compose.algorand.betanet.yml",
                catchup: "https://algorand-catchpoints.s3.us-east-2.amazonaws.com/channel/betanet/latest.catchpoint",
            },
        ];
    }
    getNodeVariant(id) {
        const nodeVariants = this.getNodeVariants();
        return nodeVariants.find((nodeVariant) => {
            return nodeVariant.id === id;
        });
    }
    async getCatchPoint() {
        const url = await this.getCatchPointUrl();
        const { data } = await axios_1.default.get(url);
        let catchpoint;
        if (data) {
            const nodeVariantId = await this.getInstalledNodeVariant();
            if (nodeVariantId === "voi_testnet") {
                catchpoint = data["last-catchpoint"];
            }
            else {
                catchpoint = data.trim();
            }
        }
        return catchpoint;
    }
};
exports.NodeService = NodeService;
exports.NodeService = NodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [keys_storage_service_1.KeysStorageService])
], NodeService);
//# sourceMappingURL=node.service.js.map