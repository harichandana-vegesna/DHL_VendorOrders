"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericUtil = void 0;
const moment_1 = __importDefault(require("moment"));
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const md5_1 = require("ts-md5/dist/md5");
class GenericUtil {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    getFormattedDate(date, format) {
        return moment_1.default(date).format(format);
    }
    getDefaultFormattedDate(date) {
        return this.getFormattedDate(date, 'YYYY-MM-DD');
    }
    getDefaultLongFormattedDate(date) {
        return this.getFormattedDate(date, 'YYYY-MM-DD HH:mm:ss');
    }
    getLocalDateFromDefaultFormat(dateStr) {
        return this.getLocalDateFromString(dateStr, 'YYYY-MM-DD');
    }
    getLocalDateFromString(dateStr, format) {
        const date = moment_1.default(dateStr, format).toDate();
        return this.getLocalDate(date);
    }
    getLocalDate(date) {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    }
    jsonToQueryString(json) {
        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }
    static generateRandomHash() {
        return md5_1.Md5.hashStr((new Date()).toString());
    }
    static generateHash(data) {
        try {
            console.log("generatehash--->", md5_1.Md5.hashStr((data).toString()));
            return md5_1.Md5.hashStr((data).toString());
        }
        catch (error) {
            console.log(`Error=========`);
            throw error;
        }
    }
}
exports.GenericUtil = GenericUtil;
