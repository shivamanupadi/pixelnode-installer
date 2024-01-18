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
exports.DmesgService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = __importDefault(require("child_process"));
let DmesgService = class DmesgService {
    async getLogs() {
        return await this.execCommand("dmesg");
    }
    async execCommand(command) {
        return new Promise((resolve, reject) => {
            child_process_1.default.exec(command, (error, stdout) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
};
exports.DmesgService = DmesgService;
exports.DmesgService = DmesgService = __decorate([
    (0, common_1.Injectable)()
], DmesgService);
//# sourceMappingURL=dmesg.service.js.map