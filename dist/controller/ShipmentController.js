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
exports.ShipmentController = void 0;
const express_1 = require("express");
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const ExpTmsService_1 = require("../service/ExpTmsService");
const ExpResponseDataService_1 = require("../service/ExpResponseDataService");
const LlpClien2Service_1 = require("../service/LlpClien2Service");
const LobsterService_1 = require("../service/LobsterService");
const AuthService_1 = require("../service/AuthService");
const VerifyJwtTokenService_1 = require("../security/VerifyJwtTokenService");
const DataGenTransformationService_1 = require("../service/DataGenTransformationService");
const DownStreamService_1 = require("../service/DownStreamService");
var request = require('request');
class ShipmentController {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.ExpTmsService = DIContainer_1.DI.get(ExpTmsService_1.ExpTmsService);
        this.ExpResponseDataService = DIContainer_1.DI.get(ExpResponseDataService_1.ExpResponseDataService);
        this.LlpClien2Service = DIContainer_1.DI.get(LlpClien2Service_1.LlpClien2Service);
        this.LobsterService = DIContainer_1.DI.get(LobsterService_1.LobsterService);
        this.DataGenTransformationService = DIContainer_1.DI.get(DataGenTransformationService_1.DataGenTransformationService);
        this.DownStreamService = DIContainer_1.DI.get(DownStreamService_1.DownStreamService);
        this.authService = DIContainer_1.DI.get(AuthService_1.AuthService);
        this.verifyJwtTokenService = DIContainer_1.DI.get(VerifyJwtTokenService_1.VerifyJwtTokenService);
    }
    getRouter() {
        const router = express_1.Router();
        //LLP-TMS//
        router.post('/expResponse', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                var responseData, response;
                //console.log("Request Body inside ShipmentController",req.body)
                responseData = yield this.ExpTmsService.ExpDhl();
                // console.log("Response in ShipmentController",responseData)
                // response = await this.ExpResponseDataService.expResData(responseData, res)
                res.json({ status: { code: 'SUCCESS', message: "Created Successfully" } });
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        //DOWNSTREAM LLP-TMS(EXP Request Data) & LLP-CLIENT2(TMS Response)//  
        router.post('/tmsResponse', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.log(`=============================================START-LLP -TMS DOWNSTREAM=======================================`);
                //this.logger.log(`BLESS REQUEST BODY is ${JSON.stringify(req.body.message)}`);
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
        //DOWNSTREAM CLIENT2-LOBSTER//
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
        router.post('/lobsterData', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                var lobMessage;
                lobMessage = yield this.LobsterService.postTmsResponseToLobster();
                res.json({ lobdata: lobMessage });
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        //Post Events Data to Lobster
        router.post('/events-to-lobster', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.LobsterService.postEventsToLobster();
                res.json({ result });
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        //DATAGEN
        router.post('/datagen', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                var pubMessage;
                //pubMessage = await this.DataGenTransformationService.dataGenTransformation("VND_ORD_LLP_TMS_DATAGEN");
                res.json({ data: pubMessage });
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: error } };
                res.json(response);
            }
        }));
        // To get TMS DATA
        router.post('/expTmsData', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                var result;
                //console.log("Request Body inside ShipmentController",req.body)
                result = yield this.ExpTmsService.expTmsData(req.body, res);
                // console.log("Response in ShipmentController",result)
                res.json({ status: { code: 'SUCCESS', message: "Created Successfully" }, data: result });
            }
            catch (error) {
                let response = { status: { code: 'FAILURE', message: "Error While Uploading The File" } };
                res.json(response);
            }
        }));
        return router;
    }
}
exports.ShipmentController = ShipmentController;
