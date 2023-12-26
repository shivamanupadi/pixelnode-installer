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
exports.ApiController = exports.Scopes = void 0;
const common_1 = require("@nestjs/common");
const check_disk_space_1 = __importDefault(require("check-disk-space"));
const os_1 = __importDefault(require("os"));
const auth_gaurd_1 = require("../../auth/services/auth.gaurd");
const shelljs_1 = __importDefault(require("shelljs"));
const is_empty_1 = __importDefault(require("is-empty"));
const node_service_1 = require("../services/node.service");
const Scopes = (...scopes) => (0, common_1.SetMetadata)("scopes", scopes);
exports.Scopes = Scopes;
let ApiController = class ApiController {
    constructor(nodeService) {
        this.nodeService = nodeService;
    }
    ping() {
        return;
    }
    async os() {
        try {
            const platform = os_1.default.platform().toLowerCase();
            let name = platform;
            if (platform === "darwin") {
                name = "MacOS";
            }
            else if (platform === "win32" || platform === "win64") {
                name = "Windows";
            }
            else if (platform == "linux") {
                name = "Linux";
            }
            const storage = await (0, check_disk_space_1.default)("/");
            return {
                platform: os_1.default.platform(),
                type: os_1.default.type(),
                arch: os_1.default.arch(),
                version: os_1.default.version(),
                name,
                storage,
                ram: os_1.default.totalmem(),
                cores: os_1.default.cpus().length,
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to fetch the os details", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async prerequisites() {
        try {
            const docker = shelljs_1.default.which("docker");
            const genesis = await this.nodeService.isInstalled();
            const variant = await this.nodeService.getInstalledNodeVariant();
            return {
                docker: !(0, is_empty_1.default)(docker),
                node: genesis,
                variant,
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to fetch the prerequisites", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, common_1.Get)("ping"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)("os"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "os", null);
__decorate([
    (0, common_1.Get)("prerequisites"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "prerequisites", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)("api"),
    __metadata("design:paramtypes", [node_service_1.NodeService])
], ApiController);
//# sourceMappingURL=api.controller.js.map