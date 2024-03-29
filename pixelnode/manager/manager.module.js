"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerModule = void 0;
const common_1 = require("@nestjs/common");
const api_controller_1 = require("./controllers/api.controller");
const storage_module_1 = require("../storage/storage.module");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const node_service_1 = require("./services/node.service");
const node_controller_1 = require("./controllers/node.controller");
const portal_controller_1 = require("./controllers/portal.controller");
const dmesg_service_1 = require("./services/dmesg.service");
const logs_controller_1 = require("./controllers/logs.controller");
const pm2_service_1 = require("./services/pm2.service");
let ManagerModule = class ManagerModule {
};
exports.ManagerModule = ManagerModule;
exports.ManagerModule = ManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [storage_module_1.StorageModule, auth_module_1.AuthModule, jwt_1.JwtModule],
        controllers: [
            api_controller_1.ApiController,
            node_controller_1.NodeController,
            portal_controller_1.PortalController,
            logs_controller_1.LogsController,
        ],
        providers: [node_service_1.NodeService, dmesg_service_1.DmesgService, pm2_service_1.Pm2Service],
    })
], ManagerModule);
//# sourceMappingURL=manager.module.js.map