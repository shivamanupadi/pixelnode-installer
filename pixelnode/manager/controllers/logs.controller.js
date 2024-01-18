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
exports.LogsController = exports.Scopes = void 0;
const common_1 = require("@nestjs/common");
const dmesg_service_1 = require("../services/dmesg.service");
const auth_gaurd_1 = require("../../auth/services/auth.gaurd");
const pm2_service_1 = require("../services/pm2.service");
const Scopes = (...scopes) => (0, common_1.SetMetadata)("scopes", scopes);
exports.Scopes = Scopes;
let LogsController = class LogsController {
    constructor(dmesgService, pm2Service) {
        this.dmesgService = dmesgService;
        this.pm2Service = pm2Service;
    }
    async dmesg() {
        try {
            return await this.dmesgService.getLogs();
        }
        catch (e) {
            throw new common_1.HttpException(e.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async pm2(type) {
        try {
            if (type === "out") {
                return await this.pm2Service.getOutLogs();
            }
            else if (type === "error") {
                return await this.pm2Service.getErrorLogs();
            }
        }
        catch (e) {
            throw new common_1.HttpException(e.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.LogsController = LogsController;
__decorate([
    (0, common_1.Get)("dmesg"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "dmesg", null);
__decorate([
    (0, common_1.Get)("pm2"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "pm2", null);
exports.LogsController = LogsController = __decorate([
    (0, common_1.Controller)("api/logs"),
    __metadata("design:paramtypes", [dmesg_service_1.DmesgService,
        pm2_service_1.Pm2Service])
], LogsController);
//# sourceMappingURL=logs.controller.js.map