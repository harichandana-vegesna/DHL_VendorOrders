"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
class Logger {
    constructor() {
        this.logger = winston_1.default.createLogger({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }), winston_1.default.format.printf(info => `${info.timestamp} ${info.level}: ${this.messageConverter(info)} \n`)),
            defaultMeta: {},
            transports: [
                new winston_1.default.transports.File({ filename: 'info.log', dirname: 'logs', maxsize: 10000, level: 'info' }),
                new winston_1.default.transports.File({ filename: 'debug.log', dirname: 'logs', maxsize: 10000, level: 'debug' }),
                new winston_1.default.transports.File({ filename: 'warn.log', dirname: 'logs', maxsize: 10000, level: 'warn' }),
                new winston_1.default.transports.File({ filename: 'error.log', dirname: 'logs', maxsize: 10000, level: 'error' }),
                new winston_1.default.transports.Console({ level: 'debug' })
            ]
        });
        this.logger.exceptions.handle(new winston_1.default.transports.File({ filename: 'exceptions.log', dirname: 'logs' }), new winston_1.default.transports.Console());
    }
    dbInsertionerror(...messages) {
        this.logger.warn('\u{274E} ', messages, '\n');
    }
    messageConverter(obj) {
        if (typeof obj === 'object') {
            return JSON.stringify(obj);
        }
        return obj;
    }
    log(...messages) {
        this.logger.debug('\u{1F590} ', messages, '\n');
    }
    info(...messages) {
        this.logger.info('\u{2139} ', messages, '\n');
    }
    warn(...messages) {
        this.logger.warn('\u{1F525} ', messages, '\n');
    }
    error(...messages) {
        this.logger.error('\u{274E} ', messages, '\n');
    }
}
exports.Logger = Logger;
