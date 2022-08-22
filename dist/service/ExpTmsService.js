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
exports.ExpTmsService = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const ExpTmsDataRepository_1 = require("../data/repository/ExpTmsDataRepository");
const ExpResponseDataRepository_1 = require("../data/repository/ExpResponseDataRepository");
const UpdateCoreTablesService_1 = require("./UpdateCoreTablesService");
var fs = require('fs');
var request = require('request');
class ExpTmsService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.ExpTmsDataRepository = DIContainer_1.DI.get(ExpTmsDataRepository_1.ExpTmsDataRepository);
        this.ExpResponseDataRepository = DIContainer_1.DI.get(ExpResponseDataRepository_1.ExpResponseDataRepository);
        this.UpdateCoreTablesService = DIContainer_1.DI.get(UpdateCoreTablesService_1.UpdateCoreTablesService);
    }
    /*
        Send EXP Message to TMS System(From LLP Node) & Persisting the TMS Response
    */
    ExpDhl() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    //Take data from exp_tms_data table and assign to tmsDataList variable
                    var tmsDataList = yield this.getAllExpTmsData();
                    //console.log("tmsDataList",tmsDataList.res, tmsDataList.res.length)
                    for (let i = 0; i <= tmsDataList.res.length; i++) {
                        //Loop through tmsDataList variable and get individual message i.e tmsDataItem["message"]
                        var message = tmsDataList.res[i].dataValues.message;
                        //console.log("customerOrderNumber---------->",tmsDataList.res[i].dataValues.message.principalRef)
                        let customerOrderNumber = tmsDataList.res[i].dataValues.message.principalRef + "";
                        console.log("customerOrderNumber", customerOrderNumber);
                        //Remove the extraneous fields from message
                        delete message["plannedShippingOffset"];
                        delete message["plannedShippingDate"];
                        delete message["sequence_timestamp"];
                        delete message["vcid"];
                        delete message["principalRef"];
                        delete message["shipper_account_number"];
                        delete message["trailToken"];
                        // console.log("Message", JSON.stringify(message));
                        var options = {
                            'method': 'POST',
                            'url': process.env.POST_URL,
                            'headers': {
                                'Authorization': 'Basic ZGhsYmxlc3NibG9DSDpDJDJhTyExbkMhMmVWQDhr',
                                'Content-Type': 'application/json',
                                'Cookie': 'BIGipServer~WSB~pl_wsb-express-cbj.dhl.com_443=293349575.64288.0000'
                            },
                            body: JSON.stringify(message)
                        };
                        let resultList = [];
                        //console.log("OPTIONS---->",options)
                        var result = yield request(options, (error, response) => __awaiter(this, void 0, void 0, function* () {
                            if (error)
                                throw new Error(error);
                            //console.log("response--->",response.body)
                            console.log("shipmentTrackingNumber----->", JSON.parse(response.body).shipmentTrackingNumber);
                            // console.log(`Reponse from TMS system is ${response.body}`);
                            var expres = {
                                statusCode: response.statusCode,
                                message: response.body,
                                shipmentTrackingNumber: JSON.parse(response.body).shipmentTrackingNumber,
                                status: "UNPROCESSED",
                                parent_uuid: tmsDataList.res[i].dataValues.uuid,
                                customer_order_number: customerOrderNumber
                            };
                            console.log("expres----->", expres);
                            //Save expResponse in `exp_response_data` table along with shipment_Tracking_Number
                            var expResponse = yield this.ExpResponseDataRepository.create(expres);
                            //Update Core Tables
                            var updateDocument = yield this.UpdateCoreTablesService.updateTmsResCoreTables(expres);
                            //Update exp_tms_data with shipment_Tracking_Number
                            var whereObj = { "id": tmsDataList.res[i].dataValues.id };
                            var updateRes = yield this.ExpTmsDataRepository.update(whereObj, {
                                shipment_Tracking_Number: JSON.parse(response.body).shipmentTrackingNumber,
                                status: "PROCESSED"
                            });
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
    //INNER FUNCTION FOR LLP-TMS//
    getAllExpTmsData() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let whereObj = {};
                try {
                    //console.log('Request Body inside ExpTmsService', req)
                    //whereObj['shipment_Tracking_Number'] = req;
                    whereObj['status'] = "UNPROCESSED";
                    let responseData = yield this.ExpTmsDataRepository.get(whereObj);
                    //console.log("Result", responseData)
                    resolve({ res: responseData });
                }
                catch (e) {
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } });
                }
            }));
        });
    }
    // To get TMS DATA
    expTmsData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('Request Body inside ExpTmsService', req);
                    var status = req.statusCode;
                    var data = req;
                    var obj = {
                        status: "UNPROCESSED",
                        shipment_Tracking_Number: "3732179850",
                        message: data
                    };
                    console.log("Object", obj);
                    var result = yield this.ExpTmsDataRepository.create(obj);
                    console.log("Result", result);
                    resolve({ status: { code: 'SUCCESS' }, res: result });
                }
                catch (e) {
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } });
                }
            }));
        });
    }
    //NOT USED//
    getexpTmsData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let whereObj = {};
                try {
                    //console.log('Request Body inside ExpTmsService', req)
                    whereObj['uuid'] = req;
                    console.log("Whereobj", whereObj);
                    //whereObj['status'] = "UNPROCESSED";
                    let responseData = yield this.ExpTmsDataRepository.get(whereObj);
                    //console.log("Result", responseData)
                    resolve({ res: responseData });
                }
                catch (e) {
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } });
                }
            }));
        });
    }
}
exports.ExpTmsService = ExpTmsService;
