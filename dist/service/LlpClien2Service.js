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
exports.LlpClien2Service = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const ExpResponseDataRepository_1 = require("../data/repository/ExpResponseDataRepository");
var fs = require('fs');
var request = require('request');
class LlpClien2Service {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.ExpResponseDataRepository = DIContainer_1.DI.get(ExpResponseDataRepository_1.ExpResponseDataRepository);
    }
    //LLP-CLIENT2//
    clientTmsResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Inside ClientTMS");
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("Test");
                    var tmsResponseList = yield this.ExpResponseDataRepository.get({ 'status': "UNPROCESSED" });
                    console.log("tmsResponseList--->", tmsResponseList);
                    for (let tmsReponseItem of tmsResponseList) {
                        //Loop through tmsDataList variable and get individual message i.e tmsDataItem["message"]
                        var message = { "tmsResponse": tmsReponseItem };
                        console.log("Message", message);
                        var options = {
                            'method': 'POST',
                            'url': process.env.CLIENT2_URL,
                            'headers': {
                                //'Authorization': req.rawHeaders[1],
                                'Content-Type': 'application/JSON'
                            },
                            body: JSON.stringify(message)
                        };
                        var result = yield request(options, (error, response) => __awaiter(this, void 0, void 0, function* () {
                            if (error)
                                throw new Error(error);
                            //var expResponse = await this.ExpResponseDataRepository.update({ "parent_uuid": tmsReponseItem.parent_uuid }, { "status": "PROCESSED" });
                        }));
                    }
                    resolve({ status: { code: 'Success' } });
                }
                catch (e) {
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } });
                }
            }));
        });
    }
}
exports.LlpClien2Service = LlpClien2Service;
