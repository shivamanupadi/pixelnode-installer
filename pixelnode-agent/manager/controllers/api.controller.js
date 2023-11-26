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
exports.ApiController = exports.Scopes = void 0;
const common_1 = require("@nestjs/common");
const check_disk_space_1 = __importDefault(require("check-disk-space"));
const os_1 = __importDefault(require("os"));
const auth_gaurd_1 = require("../../auth/services/auth.gaurd");
const shelljs_1 = __importDefault(require("shelljs"));
const path_1 = __importDefault(require("path"));
const is_empty_1 = __importDefault(require("is-empty"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const auth_service_1 = require("../../auth/services/auth.service");
const constants_1 = require("../../constants");
const node_service_1 = require("../services/node.service");
const dockerstats_1 = require("dockerstats");
const algosdk_1 = require("algosdk");
const keys_storage_service_1 = require("../../storage/services/keys.storage.service");
const users_storage_service_1 = require("../../storage/services/users.storage.service");
const Scopes = (...scopes) => (0, common_1.SetMetadata)("scopes", scopes);
exports.Scopes = Scopes;
let ApiController = class ApiController {
    constructor(authService, nodeService, keysStorageService, usersStorageService) {
        this.authService = authService;
        this.nodeService = nodeService;
        this.keysStorageService = keysStorageService;
        this.usersStorageService = usersStorageService;
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
    async fileExists(path) {
        try {
            await fs_extra_1.default.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
    async prerequisites() {
        try {
            const docker = await shelljs_1.default.which("docker");
            const genesis = await this.nodeService.isInstalled();
            const variantId = await this.nodeService.getInstalledNodeVariant();
            const variant = this.nodeService.getNodeVariant(variantId);
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
            const command = `docker-compose -f ${dockerComposeFile} up -d`;
            const installed = shelljs_1.default.exec(command).code;
            await this.nodeService.setNodeVariant(nodeVariantId);
            this.catchup();
            return {
                installed: installed !== 0,
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to install the node", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async start() {
        const isInstalled = await this.nodeService.isInstalled();
        if (!isInstalled) {
            throw new common_1.HttpException("node is not installed", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const dockerComposeFile = await this.nodeService.getNodeDockerComposeFile();
            const command = `docker-compose -f ${dockerComposeFile} up -d`;
            const start = shelljs_1.default.exec(command).code;
            this.catchup();
            return {
                start: start !== 0,
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to start the node", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async catchup() {
        try {
            const catchpoint = await this.nodeService.getCatchPoint();
            const command = `docker exec ${constants_1.NODE_CONTAINER} goal node catchup ${catchpoint}`;
            shelljs_1.default.exec(command);
        }
        catch (e) {
            throw new common_1.HttpException("unable to initiate the fast catchup", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async stop() {
        try {
            const command = `docker exec ${constants_1.NODE_CONTAINER} goal node stop`;
            const stop = shelljs_1.default.exec(command).code;
            return {
                stop: stop !== 0,
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to stop the node", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePortal() {
        try {
            const command = `sh update.sh`;
            const update = shelljs_1.default.exec(command).code;
            return {
                update: update !== 0,
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to update the portal", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async participationKeys(body) {
        try {
            const { address, firstRound, lastRound } = body;
            return shelljs_1.default.exec(`docker exec ${constants_1.NODE_CONTAINER} goal account addpartkey -a ${address} --roundFirstValid=${firstRound} --roundLastValid=${lastRound}`);
        }
        catch (e) {
            throw new common_1.HttpException("unable to generate the participation key", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
            catch (e) { }
            if (nodeHealth) {
                try {
                    await algodClient.ready().do();
                    nodeCaughtup = true;
                }
                catch (e) { }
            }
            if (nodeHealth) {
                try {
                    status = (await algodClient.status().do());
                }
                catch (e) { }
            }
            const variantId = await this.nodeService.getInstalledNodeVariant();
            nodeVariant = this.nodeService.getNodeVariant(variantId);
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
    async setup() {
        let setupCompleted = false;
        try {
            setupCompleted = await this.authService.isSetupCompleted();
        }
        catch (e) { }
        return {
            setup: setupCompleted,
        };
    }
    async nodeStats() {
        try {
            const data = await (0, dockerstats_1.dockerContainerStats)(constants_1.NODE_CONTAINER);
            if (data && data.length > 0) {
                return data[0];
            }
        }
        catch (e) { }
    }
    async reset() {
        await this.stop();
        const dataPath = path_1.default.resolve("./data");
        const deleteCommand = `rm -r ${dataPath}`;
        shelljs_1.default.exec(deleteCommand);
        await this.keysStorageService.delete(constants_1.KEYS_STORAGE.NODE_VARIANT);
        return true;
    }
    async updateNode() {
        try {
            const command = `docker-compose pull && docker-compose down && docker-compose up -d`;
            const update = shelljs_1.default.exec(command).code;
            return {
                update: update !== 0,
            };
        }
        catch (e) {
            throw new common_1.HttpException("unable to update the node", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
__decorate([
    (0, common_1.Post)("install"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "install", null);
__decorate([
    (0, common_1.Post)("start"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "start", null);
__decorate([
    (0, common_1.Post)("catchup"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "catchup", null);
__decorate([
    (0, common_1.Post)("stop"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "stop", null);
__decorate([
    (0, common_1.Post)("update-portal"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "updatePortal", null);
__decorate([
    (0, common_1.Post)("participation-keys"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "participationKeys", null);
__decorate([
    (0, common_1.Get)("node-variants"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], ApiController.prototype, "getNodeVariants", null);
__decorate([
    (0, common_1.Get)("algod"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "algod", null);
__decorate([
    (0, common_1.Get)("status"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "status", null);
__decorate([
    (0, common_1.Get)("setup"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "setup", null);
__decorate([
    (0, common_1.Get)("performance"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "nodeStats", null);
__decorate([
    (0, common_1.Post)("reset"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "reset", null);
__decorate([
    (0, common_1.Post)("update-node"),
    (0, common_1.UseGuards)(auth_gaurd_1.AuthGuard),
    (0, exports.Scopes)("api"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "updateNode", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)("api"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        node_service_1.NodeService,
        keys_storage_service_1.KeysStorageService,
        users_storage_service_1.UsersStorageService])
], ApiController);
//# sourceMappingURL=api.controller.js.map