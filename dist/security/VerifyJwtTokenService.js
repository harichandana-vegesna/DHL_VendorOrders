"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyJwtTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
// const config = require('../config/config.js');
class VerifyJwtTokenService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let bearerHeader = req.headers['authorization'];
            console.log('auth', bearerHeader);
            let token = '';
            if (bearerHeader != undefined) {
                token = bearerHeader.split(" ")[1];
            }
            console.log('verifying jwt', token);
            if (!token) {
                return res.status(403).send({
                    auth: false, message: 'No token provided.'
                });
            }
            let key = process.env.KEY;
            jsonwebtoken_1.default.verify(token, key, (err, authData) => {
                if (err) {
                    return res.status(403).send({
                        auth: false,
                        message: 'Invalid Token'
                    });
                }
                authData;
                next();
            });
        });
    }
}
exports.VerifyJwtTokenService = VerifyJwtTokenService;
