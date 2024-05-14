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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = exports.Scopes = void 0;
const common_1 = require("@nestjs/common");
const auth_gaurd_1 = require("../../auth/services/auth.gaurd");
const shelljs_1 = __importDefault(require("shelljs"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const constants_1 = require("../../constants");
const node_service_1 = require("../services/node.service");
const dockerstats_1 = require("dockerstats");
const algosdk_1 = require("algosdk");
const keys_storage_service_1 = require("../../storage/services/keys.storage.service");
const newline_remove_1 = __importDefault(require("newline-remove"));
const Scopes = (...scopes) => (0, common_1.SetMetadata)("scopes", scopes);
exports.Scopes = Scopes;
let NodeController = class NodeController {
    constructor(nodeService, keysStorageService) {
        this.nodeService = nodeService;
        this.keysStorageService = keysStorageService;
    }
    async install(payload) {
        const { nodeVariantId } = payload;
        if (!nodeVariantId) {
            throw new common_1.HttpException("no node variant", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!this.nodeService.isValidNodeVariant(nodeVariantId)) {
            throw new common_1.HttpException("invalid node variant", common_1.HttpStatus.BAD_REQUEST);
        }
        const isInstalled = await this.nodeService.isInstalled();
        if (isInstalled) {
            throw new common_1.HttpException("node is already installed", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const dockerComposeFile = this.nodeService.getDockerComposeFileByNodeVariant(nodeVariantId);
            const command = `docker compose -f ${dockerComposeFile} up -d`;
            shelljs_1.default.exec(command);
            await this.nodeService.setNodeVariant(nodeVariantId);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to install the node", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async restart() {
        const isInstalled = await this.nodeService.isInstalled();
        if (!isInstalled) {
            throw new common_1.HttpException("node is not installed", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const dockerComposeFile = await this.nodeService.getNodeDockerComposeFile();
            const command = `docker compose -f ${dockerComposeFile} down && docker compose -f ${dockerComposeFile} up -d`;
            shelljs_1.default.exec(command);
            await this.catchup();
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to start the node", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async catchup() {
        try {
            const catchpoint = await this.nodeService.getCatchPoint();
            const variant = await this.nodeService.getInstalledNodeVariant();
            const command = `docker exec ${variant.containerId} goal node catchup ${catchpoint}`;
            shelljs_1.default.exec(command);
        }
        catch (e) {
            throw new common_1.HttpException("unable to initiate the fast catchup", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async setMetrics(body) {
        const { status } = body;
        if (!status) {
            throw new common_1.HttpException("invalid configuration", common_1.HttpStatus.BAD_REQUEST);
        }
        if (status !== "enable" && status !== "disable") {
            throw new common_1.HttpException("invalid configuration", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const variant = await this.nodeService.getInstalledNodeVariant();
            shelljs_1.default.exec(`docker exec ${variant.containerId} diagcfg metric ${status}`);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to set metrics", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMetrics() {
        try {
            const variant = await this.nodeService.getInstalledNodeVariant();
            const str = shelljs_1.default.exec(`docker exec ${variant.containerId} diagcfg metric status`);
            if (str) {
                return str.includes("enabled");
            }
            return false;
        }
        catch (e) {
            throw new common_1.HttpException("unable to get metrics", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTelemetry() {
        try {
            const variant = await this.nodeService.getInstalledNodeVariant();
            const str = shelljs_1.default.exec(`docker exec ${variant.containerId} diagcfg telemetry status`);
            if (str) {
                return str.includes("enabled");
            }
            return false;
        }
        catch (e) {
            throw new common_1.HttpException("unable to get telemetry status", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTelemetryConfig() {
        try {
            const str = fs_extra_1.default
                .readFileSync(path_1.default.resolve("./data/logging.config"))
                .toString();
            const loggingConfig = JSON.parse(str);
            return {
                guid: loggingConfig?.GUID || "",
                name: loggingConfig?.Name || "",
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to get telemetry guid", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async setTelemetry(body) {
        const { status } = body;
        if (!status) {
            throw new common_1.HttpException("invalid configuration", common_1.HttpStatus.BAD_REQUEST);
        }
        if (status !== "enable" && status !== "disable") {
            throw new common_1.HttpException("invalid configuration", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const variant = await this.nodeService.getInstalledNodeVariant();
            shelljs_1.default.exec(`docker exec ${variant.containerId} diagcfg telemetry ${status}`);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to set telemetry", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async setTelemetryName(body) {
        const { name } = body;
        if (!name) {
            throw new common_1.HttpException("invalid name", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const variant = await this.nodeService.getInstalledNodeVariant();
            const isEnabled = await this.getTelemetry();
            const status = isEnabled ? "enable" : "disable";
            shelljs_1.default.exec(`docker exec ${variant.containerId} diagcfg telemetry name -n ${name}`);
            shelljs_1.default.exec(`docker exec ${variant.containerId} diagcfg telemetry ${status}`);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to set telemetry name", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getNodeVariants() {
        return this.nodeService.getNodeVariants();
    }
    async algod(req) {
        try {
            const token = fs_extra_1.default
                .readFileSync(path_1.default.resolve("./data/algod.token"))
                .toString();
            const adminToken = fs_extra_1.default
                .readFileSync(path_1.default.resolve("./data/algod.admin.token"))
                .toString();
            return {
                algod: {
                    url: `${req.protocol}://${req.hostname}`,
                    port: "4190",
                    token,
                },
                admin: {
                    token: adminToken,
                },
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to fetch the algod configuration", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async status(req) {
        const agentHealth = true;
        let nodeHealth = false;
        let nodeCaughtup = false;
        let nodeVariant;
        let status;
        const nodeInstalled = await this.nodeService.isInstalled();
        if (nodeInstalled) {
            const { algod } = await this.algod(req);
            const { url, port, token } = algod;
            const algodClient = new algosdk_1.Algodv2(token, url, port);
            try {
                await algodClient.healthCheck().do();
                nodeHealth = true;
            }
            catch (e) {
            }
            if (nodeHealth) {
                try {
                    await algodClient.ready().do();
                    nodeCaughtup = true;
                }
                catch (e) {
                }
            }
            if (nodeHealth) {
                try {
                    status = (await algodClient.status().do());
                }
                catch (e) {
                }
            }
            nodeVariant = await this.nodeService.getInstalledNodeVariant();
        }
        return {
            agent: {
                health: agentHealth,
            },
            node: {
                installed: nodeInstalled,
                health: nodeHealth,
                caughtup: nodeCaughtup,
                status: status,
                variant: nodeVariant,
            },
        };
    }
    async nodeStats() {
        try {
            const variant = await this.nodeService.getInstalledNodeVariant();
            const data = await (0, dockerstats_1.dockerContainerStats)(variant.containerId);
            if (data && data.length > 0) {
                return data[0];
            }
        }
        catch (e) {
        }
    }
    async uninstall() {
        const isInstalled = await this.nodeService.isInstalled();
        if (!isInstalled) {
            throw new common_1.HttpException("node is not installed", common_1.HttpStatus.BAD_REQUEST);
        }
        const variant = await this.nodeService.getInstalledNodeVariant();
        const command = `docker compose -f ${variant.dockerComposeFile} down -v`;
        shelljs_1.default.exec(command);
        const dataPath = path_1.default.resolve("./data");
        const deleteCommand = `rm -r ${dataPath}`;
        shelljs_1.default.exec(deleteCommand);
        await this.keysStorageService.delete(constants_1.KEYS_STORAGE.NODE_VARIANT);
        return true;
    }
    async updateNode() {
        try {
            const variant = await this.nodeService.getInstalledNodeVariant();
            const { dockerComposeFile } = variant;
            const command = `docker compose -f ${dockerComposeFile} down && docker compose -f ${dockerComposeFile} pull && docker compose -f ${dockerComposeFile} up -d`;
            shelljs_1.default.exec(command);
            return true;
        }
        catch (e) {
            throw new common_1.HttpException("unable to update the node", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNodeEnv() {
        try {
            const result = {
                GOGC: "",
                GOMEMLIMIT: "",
            };
            const variant = await this.nodeService.getInstalledNodeVariant();
            const { containerId } = variant;
            const command1 = `docker exec ${containerId} sh -c 'echo $GOGC'`;
            const { stdout: stdout1 } = shelljs_1.default.exec(command1);
            const command2 = `docker exec ${containerId} sh -c 'echo $GOMEMLIMIT'`;
            const { stdout: stdout2 } = shelljs_1.default.exec(command2);
            if (stdout1) {
                result.GOGC = (0, newline_remove_1.default)(stdout1);
            }
            if (stdout2) {
                result.GOMEMLIMIT = (0, newline_remove_1.default)(stdout2);
            }
            return result;
        }
        catch (e) {
            throw new common_1.HttpException("unable to get node env", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.NodeController = NodeController;
__decorate([
    (0, common_1.Post)("install"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "install", null);
__decorate([
    (0, common_1.Post)("restart"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "restart", null);
__decorate([
    (0, common_1.Post)("catchup"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "catchup", null);
__decorate([
    (0, common_1.Post)("metrics"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "setMetrics", null);
__decorate([
    (0, common_1.Get)("metrics"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)("telemetry"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "getTelemetry", null);
__decorate([
    (0, common_1.Get)("telemetry-config"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "getTelemetryConfig", null);
__decorate([
    (0, common_1.Post)("telemetry"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "setTelemetry", null);
__decorate([
    (0, common_1.Post)("telemetry-name"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "setTelemetryName", null);
__decorate([
    (0, common_1.Get)("variants"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], NodeController.prototype, "getNodeVariants", null);
__decorate([
    (0, common_1.Get)("algod"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "algod", null);
__decorate([
    (0, common_1.Get)("status"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "status", null);
__decorate([
    (0, common_1.Get)("performance"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "nodeStats", null);
__decorate([
    (0, common_1.Post)("uninstall"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "uninstall", null);
__decorate([
    (0, common_1.Post)("update"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "updateNode", null);
__decorate([
    (0, common_1.Get)("env"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "getNodeEnv", null);
exports.NodeController = NodeController = __decorate([
    (0, common_1.Controller)("api/node"),
    __metadata("design:paramtypes", [node_service_1.NodeService,
        keys_storage_service_1.KeysStorageService])
], NodeController);
//# sourceMappingURL=node.controller.js.map