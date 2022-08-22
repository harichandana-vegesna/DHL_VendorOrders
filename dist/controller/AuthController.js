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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_1 = require("express");
const DIContainer_1 = require("../di/DIContainer");
const Logger_1 = require("../logger/Logger");
const AuthService_1 = require("../service/AuthService");
class AuthController {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.authService = DIContainer_1.DI.get(AuthService_1.AuthService);
    }
    getRouter() {
        let router = express_1.Router();
        router.get('/generate-token', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let token = yield this.authService.generateJWTToken({ "user": "uat-downstreamuser", "password": "bless123$" });
                console.log(`TOken in controller is ${token}`);
                res.json(token);
            }
            catch (error) {
                next(error);
            }
        }));
        return router;
    }
}
exports.AuthController = AuthController;
