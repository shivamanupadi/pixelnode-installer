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
exports.PortalController = exports.Scopes = void 0;
const common_1 = require("@nestjs/common");
const auth_gaurd_1 = require("../../auth/services/auth.gaurd");
const path_1 = __importDefault(require("path"));
const auth_service_1 = require("../../auth/services/auth.service");
const node_service_1 = require("../services/node.service");
const child_process_1 = __importDefault(require("child_process"));
const Scopes = (...scopes) => (0, common_1.SetMetadata)("scopes", scopes);
exports.Scopes = Scopes;
let PortalController = class PortalController {
    constructor(authService, nodeService) {
        this.authService = authService;
        this.nodeService = nodeService;
    }
    async setup() {
        let setupCompleted = false;
        try {
            setupCompleted = await this.authService.isSetupCompleted();
        }
        catch (e) { }
        return setupCompleted;
    }
    async update() {
        try {
            const scriptPath = path_1.default.resolve("update.sh");
            await this.execCommand(`sh ${scriptPath}`);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to update the portal", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async restart() {
        try {
            const scriptPath = path_1.default.resolve("restart.sh");
            await this.execCommand(`sh ${scriptPath}`);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to restart the portal", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async execCommand(command) {
        return new Promise((resolve, reject) => {
            child_process_1.default.exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr);
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, common_1.Get)("setup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "setup", null);
__decorate([
    (0, common_1.Post)("update"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("restart"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "restart", null);
exports.PortalController = PortalController = __decorate([
    (0, common_1.Controller)("api/portal"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        node_service_1.NodeService])
], PortalController);
//# sourceMappingURL=portal.controller.js.map