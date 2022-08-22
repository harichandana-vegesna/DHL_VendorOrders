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
exports.DownStreamController = void 0;
const express_1 = require("express");
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const AuthService_1 = require("../service/AuthService");
const DownStreamService_1 = require("../service/DownStreamService");
const ExpResponseDataRepository_1 = require("../data/repository/ExpResponseDataRepository");
var request = require('request');
class DownStreamController {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.DownStreamService = DIContainer_1.DI.get(DownStreamService_1.DownStreamService);
        this.expResponseDataRepository = DIContainer_1.DI.get(ExpResponseDataRepository_1.ExpResponseDataRepository);
    }
    getRouter() {
        const router = express_1.Router();
        router.post('/exp-bkng-rqst', AuthService_1.AuthService.verifyToken, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let token = yield this.DownStreamService.expBookingReqDownStreamHandler(req.body.message);
                res.json({ "token": token });
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        /*
            **Downstream Wrapper which handles the TMS Response and posts it to LOBSTER system.
            
        */
        router.post('/consume-tms-response', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let expResponseList;
                if (Array.isArray(req.body)) {
                    expResponseList = req.body;
                }
                else {
                    expResponseList = [req.body];
                }
                this.logger.log(`req.body is ${JSON.stringify(req.body)}`);
                yield this.DownStreamService.consumeTMSResponse(req.body["tmsResponse"]);
                res.json({ "token": "" });
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        /*
            **Downstream Wrapper which handles the TMS Response and persist response in LLP system.
            
        */
        router.post('/tmsResponse', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.log(`=============================================START-TMS To LLP DOWNSTREAM=======================================`);
                this.logger.log(`BLESS REQUEST BODY is ${JSON.parse(req.body.message)}`);
                //Calling Downstream service from LLP to TMS
                var downstreamToTmsSystem = yield this.DownStreamService.downStreamToTmsSystem(JSON.parse(req.body.message).transformedMessage, res);
                //var response = await this.LlpClien2Service.clientTmsResponse();
                res.json({ token: downstreamToTmsSystem });
                this.logger.log(`=============================================END-TMS To LLP DOWNSTREAM=======================================`);
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        /*
            **Downstream Wrapper which handles the TMS Response and posts it to LOBSTER system.
            
        */
        router.post('/client-lobster-tms-resp', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.log(`=============================================START-C2 To Lobster DOWNSTREAM=======================================`);
                this.logger.log(`BLESS REQUEST BODY is ${JSON.parse(req.body.message)}`);
                var lobMessage = yield this.DownStreamService.downStreamToLobsterSystem(JSON.parse(req.body.message).transformedMessage, res);
                res.json({ token: lobMessage });
                this.logger.log(`=============================================END-C2 To Lobster DOWNSTREAM=======================================`);
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        return router;
    }
}
exports.DownStreamController = DownStreamController;
