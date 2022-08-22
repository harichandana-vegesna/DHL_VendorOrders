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
exports.ExpResponseDataService = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const ExpResponseDataRepository_1 = require("../data/repository/ExpResponseDataRepository");
var fs = require('fs');
class ExpResponseDataService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.ExpResponseDataRepository = DIContainer_1.DI.get(ExpResponseDataRepository_1.ExpResponseDataRepository);
    }
    expResData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('Request Body inside ExpResponseDataService', req);
                    var status = req.res.statusCode;
                    var data = req.res.data;
                    var data1 = JSON.parse(data);
                    var shipmentTrackingNumber = data1.shipmentTrackingNumber;
                    var obj;
                    if (status == 201) {
                        obj = {
                            statusCode: status,
                            status: "UNPROCESSED",
                            shipmentTrackingNumber: shipmentTrackingNumber,
                            message: data
                        };
                    }
                    console.log("Object", obj);
                    var result = yield this.ExpResponseDataRepository.create(obj);
                    console.log("Result", result);
                    resolve({ res: result });
                }
                catch (e) {
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } });
                }
            }));
        });
    }
    getexpResData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let whereObj = {};
                try {
                    console.log('Request Body inside ExpResponseDataService', req);
                    whereObj['shipmentTrackingNumber'] = req;
                    whereObj['status'] = "UNPROCESSED";
                    let responseData = yield this.ExpResponseDataRepository.get(whereObj);
                    //console.log("Result",responseData)                           
                    resolve(responseData);
                }
                catch (e) {
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } });
                }
            }));
        });
    }
}
exports.ExpResponseDataService = ExpResponseDataService;
