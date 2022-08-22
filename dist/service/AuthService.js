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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bluebird_1 = require("bluebird");
class AuthService {
    constructor() {
    }
    generateJWTToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`GENRATING TOKEN`);
            let key = process.env.KEY;
            let token = jsonwebtoken_1.default.sign(user, key, {
                expiresIn: '365d'
            });
            console.log(`Token is ${token}`);
            return token;
            bluebird_1.resolve(new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let key = process.env.KEY;
                let token = jsonwebtoken_1.default.sign(user, key, {
                    expiresIn: 86400
                });
                resolve({ user: user, accessToken: token });
            })));
        });
    }
    static verifyToken(req, res, next) {
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
exports.AuthService = AuthService;
