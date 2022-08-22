"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtil = void 0;
const fs_1 = __importDefault(require("fs"));
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
class FileUtil {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    writeToFile(filePath, data) {
        try {
            fs_1.default.writeFile(filePath, data, { flag: 'w' }, e => {
                if (e)
                    console.error(e);
                this.logger.log('Data written to File');
            });
        }
        catch (err) {
            this.logger.log(err);
        }
    }
}
exports.FileUtil = FileUtil;
