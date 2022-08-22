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
exports.DownStreamService = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const ExpTmsDataRepository_1 = require("../data/repository/ExpTmsDataRepository");
const bluebird_1 = require("bluebird");
const GenericUtil_1 = require("../util/GenericUtil");
const FileUtil_1 = require("../util/FileUtil");
const ExpResponseDataRepository_1 = require("../data/repository/ExpResponseDataRepository");
const UpdateCoreTablesService_1 = require("./UpdateCoreTablesService");
var request = require('request');
const VendorBookingRepository_1 = require("../data/repository/VendorBookingRepository");
const AddressRepository_1 = require("../data/repository/AddressRepository");
const LobsterTransformationService_1 = require("./LobsterTransformationService");
const DataGenTransformationService_1 = require("../service/DataGenTransformationService");
var fs = require('fs');
class DownStreamService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.ExpTmsDataRepository = DIContainer_1.DI.get(ExpTmsDataRepository_1.ExpTmsDataRepository);
        this.ExpResponseDataRepository = DIContainer_1.DI.get(ExpResponseDataRepository_1.ExpResponseDataRepository);
        this.UpdateCoreTablesService = DIContainer_1.DI.get(UpdateCoreTablesService_1.UpdateCoreTablesService);
        this.LobsterTransformationService = DIContainer_1.DI.get(LobsterTransformationService_1.LobsterTransformationService);
        this.AddressRepository = DIContainer_1.DI.get(AddressRepository_1.AddressRepository);
        this.VendorBoookingRepository = DIContainer_1.DI.get(VendorBookingRepository_1.VendorBookingRepository);
        this.DataGenTransformationService = DIContainer_1.DI.get(DataGenTransformationService_1.DataGenTransformationService);
        this.genericUtil = DIContainer_1.DI.get(GenericUtil_1.GenericUtil);
        this.fileUtil = DIContainer_1.DI.get(FileUtil_1.FileUtil);
    }
    expBookingReqDownStreamHandler(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = GenericUtil_1.GenericUtil.generateRandomHash();
            //Remove extraneous fields i.e plannedShipmentDate and plannedShipmentOffset fields
            delete message["plannedShippingDate"];
            delete message["plannedShippingOffset"];
            delete message[""];
            //Insert Exp-Booking Request Data in exp_tms_data Table
            yield this.ExpTmsDataRepository.create({
                "message": message,
                "shipment_Tracking_Number": "",
                "status": "UNPROCESSED",
                "token": token
            });
            return token;
        });
    }
    expBookingResponseDownStreamHandler(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = GenericUtil_1.GenericUtil.generateRandomHash();
            //Insert Exp-Booking Response Data in `exp_response_data` Table
            yield this.ExpResponseDataRepository.create({
                "message": message,
                "shipment_Tracking_Number": message["shipmentTrackingNumber"],
                "status": "UNPROCESSED",
                "token": token
            });
            return token;
        });
    }
    publishToEXpTMS() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Get all the EXP Booking Request Messages which are not sent to EXP TMS system i.e {"status":"UNPROCESSED"}
                const expBookingReqList = yield this.ExpTmsDataRepository.get({ "status": "UNPROCESSED" });
                let expTmsResponse = [];
                let options = {
                    'method': 'POST',
                    'url': process.env.POST_URL,
                    'headers': {
                        'Authorization': process.env.EXP_TMS_AUTH,
                        'Content-Type': 'application/json',
                        'Cookie': 'BIGipServer~WSB~pl_wsb-express-cbj.dhl.com_443=293349575.64288.0000'
                    },
                    body: ""
                };
                for (let expBookingReqItem of expBookingReqList) {
                    options["body"] = JSON.stringify(expBookingReqItem);
                    expTmsResponse = yield request(options, function (error, response) {
                        if (error)
                            throw new Error(error);
                        response = {
                            statusCode: response.statusCode,
                            data: response.body
                        };
                        console.log("Response from EXP TMS System: ", response);
                        bluebird_1.resolve({ res: response });
                    });
                    //Insert EXP_TMS-Response into `exp_response_data` table
                    yield this.ExpResponseDataRepository.create({ "message": "" });
                }
            }
            catch (e) {
                //resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } })
            }
        });
    }
    consumeTMSResponse(expResponseItem) {
        return __awaiter(this, void 0, void 0, function* () {
            let expRespCreateObj = { "customer_order_number": expResponseItem["customer_order_number"], "message": expResponseItem["message"], "shipmentTrackingNumber": expResponseItem["shipmentTrackingNumber"], status: "UNPROCESSED", "statusCode": expResponseItem["statusCode"], "parent_uuid": expResponseItem["parent_uuid"] };
            //Update Core Tables
            var dataObj = expResponseItem;
            console.log("dataObj", dataObj);
            var updateDocument = yield this.UpdateCoreTablesService.updateTmsResCoreTables(dataObj);
            return yield this.ExpResponseDataRepository.create(expRespCreateObj);
        });
    }
    /*
        DownStream Service to send EXP Message to TMS System(From LLP Node) & Persisting the TMS Response
    */
    downStreamToTmsSystem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            let customerOrderNumber;
            try {
                this.logger.log("Request---------->/n/n", req);
                message = JSON.parse(Buffer.from(req, 'base64').toString('utf-8')).body;
                this.logger.log("Data after converting base64---->/n/n", message);
                customerOrderNumber = message.principalRef + "";
                const token = GenericUtil_1.GenericUtil.generateRandomHash();
                //Creating the Data Object from exp_tms_data table and Persisting the Data
                var tmsDataobj = {
                    status: "UNPROCESSED",
                    shipment_Tracking_Number: "",
                    message: message,
                    customer_order_number: customerOrderNumber,
                    token: token
                };
                //this.logger.log("Object", tmsDataobj)
                yield this.ExpTmsDataRepository.create(tmsDataobj);
                //Remove the extraneous fields from message
                delete message["plannedShippingOffset"];
                delete message["plannedShippingDate"];
                delete message["sequence_timestamp"];
                delete message["vcid"];
                delete message["principalRef"];
                delete message["shipper_account_number"];
                delete message["trailToken"];
                //this.logger.log("Message after deleteing-------->/n/n",message);
                //Creating the Data Object from tms data and calling TMS URL
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
                //Write the request to file
                console.log("MESSAGE------------------------------------------------------>", JSON.stringify(message));
                const fileName = GenericUtil_1.GenericUtil.generateHash(JSON.stringify(message));
                const filePath = process.env.REQ_TO_TMS_FILE_PATH + fileName + '.txt';
                this.fileUtil.writeToFile(filePath, JSON.stringify(message));
                this.logger.log(`filePath is -----------------------------> ${filePath}`);
                this.logger.log(`fileName is -----------------------------> ${fileName}`);
                //this.logger.log("OPTIONS---->\n\n",options)
                yield request(options, (error, response) => __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        throw new Error(error);
                    var expres = {
                        statusCode: response.statusCode,
                        message: response.body,
                        shipmentTrackingNumber: JSON.parse(response.body).shipmentTrackingNumber,
                        status: "UNPROCESSED",
                        customer_order_number: customerOrderNumber,
                        req_file_path: filePath,
                        req_file_uuid: fileName
                    };
                    this.logger.log("expres----->\n\n", expres);
                    //this.logger.log("Response-------->\n\n",Buffer.from(JSON.stringify({"body":expres})).toString("base64"))
                    //Save expResponse in `exp_response_data` table along with shipment_Tracking_Number
                    yield this.ExpResponseDataRepository.create(expres);
                    //Update Core Tables
                    yield this.UpdateCoreTablesService.updateTmsResCoreTables(expres);
                    //Update exp_tms_data with shipment_Tracking_Number
                    let whereObj = { "customer_order_number": customerOrderNumber };
                    //this.logger.log("WhereOBJ---->\n\n",whereObj)
                    yield this.ExpTmsDataRepository.update(whereObj, {
                        shipment_Tracking_Number: JSON.parse(response.body).shipmentTrackingNumber,
                        status: "PROCESSED"
                    });
                    // Datagen service Sends TMS-Resp from LLP to Client2
                    const updateObj = { status: "PROCESSED" };
                    yield this.DataGenTransformationService.dataGenTransformation(process.env.DATAGEN_TMS_RESP_MSG);
                    // this.logger.log("AFTER DATAGEN RES TABLES---->",whereObj,updateObj)
                    //await this.ExpResponseDataRepository.update( whereObj, updateObj );
                    // this.logger.log("updateStatus----------->",updateStatus)
                }));
                // let whereObj = { "customer_order_number":customerOrderNumber}
                // let updateObj = { status: "PROCESSED" }
                // this.logger.log("AFTER DATAGEN RES TABLES---->",whereObj,updateObj);
                // await this.ExpResponseDataRepository.update(whereObj,updateObj);
                return token;
            }
            catch (error) {
                //resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } })
                //Update processing_status of events table to ERROR
                console.log("Error----->", error);
                //await this.ExpResponseDataRepository.update({ "customer_order_number" : customerOrderNumber }, { "status": "ERROR", "error_reason": error });
                bluebird_1.resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: error } });
            }
        });
    }
    /*
        DownStream Service to send TMS Response to LOBSTER System & Persisting the LOBSTER Response
    */
    downStreamToLobsterSystem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let baseMessage;
            try {
                baseMessage = JSON.parse(Buffer.from(req, 'base64').toString('utf-8')).body;
                this.logger.log("Data after converting base64---->/n/n", baseMessage);
                var conMessage;
                const token = GenericUtil_1.GenericUtil.generateRandomHash();
                var expres = {
                    statusCode: baseMessage.statusCode,
                    message: baseMessage.message,
                    shipmentTrackingNumber: baseMessage.shipmentTrackingNumber,
                    status: "UNPROCESSED",
                    customer_order_number: baseMessage.customer_order_number
                };
                //Update Core Tables
                var updateDocument = yield this.UpdateCoreTablesService.updateTmsResCoreTables(expres);
                //Derive accountNumber to be sent to LOSTER system
                this.logger.log("baseMessage.customer_order_number-------->\n\n", baseMessage.customer_order_number);
                let vendorOrderItem = (yield this.VendorBoookingRepository.get({ "customer_order_number": baseMessage.customer_order_number }));
                if (vendorOrderItem.length > 0) {
                    var id = vendorOrderItem[0]["id"];
                }
                else {
                    //Save Error Message to exp_response_data table
                    yield this.ExpResponseDataRepository.update({ "customer_order_number": baseMessage.customer_order_number }, { "status": "ERROR", "error_reason": `No Vendor Booking Found with customer_order_number=${baseMessage["customer_order_number"]}` });
                    //continue;
                }
                let addressList = yield this.AddressRepository.get({ "address_type": "consignor", "parent_id": id });
                let accountNumber;
                if (addressList.length > 0) {
                    accountNumber = addressList[0]["address_id"];
                }
                else {
                    accountNumber = "";
                }
                this.logger.log(`Account Number is ${accountNumber}`);
                var message = {
                    "content": {
                        "accountNumber": accountNumber,
                        "HAWB": baseMessage.shipmentTrackingNumber,
                        "PrincipalreferenceNumber": baseMessage.customer_order_number,
                        "documents": JSON.parse(baseMessage.message).documents,
                        "estimatedDeliveryDate": JSON.parse(baseMessage.estimatedDeliveryDate).estimatedDeliveryDate
                    }
                };
                this.logger.log("message----->\n\n", message);
                //Removing extraneous fields in the error message
                var errorBody = JSON.parse(baseMessage.message);
                delete errorBody["instance"];
                delete errorBody["message"];
                var errorMessage = {
                    "content": {
                        "accountNumber": accountNumber,
                        "HAWB": baseMessage.shipmentTrackingNumber,
                        "PrincipalreferenceNumber": baseMessage.customer_order_number,
                        "documents": JSON.parse(baseMessage.message).documents,
                        "estimatedDeliveryDate": ""
                    },
                    "error": errorBody
                };
                // this.logger.log("errorMessage--->",errorMessage)
                //Construct final Lobster POST message
                if (baseMessage.statusCode == 201) {
                    conMessage = yield this.LobsterTransformationService.lobData(message);
                }
                else {
                    conMessage = yield this.LobsterTransformationService.lobData(errorMessage, true);
                }
                this.logger.log("conMessage---->", conMessage);
                const fileName = GenericUtil_1.GenericUtil.generateHash(JSON.stringify(conMessage.tdata));
                const filePath = process.env.REQ_TO_LOBSTER_FILE_PATH + fileName + '.txt';
                this.fileUtil.writeToFile(filePath, JSON.stringify(conMessage.tdata));
                this.logger.log(`filePath is ${filePath}`);
                var options = {
                    'method': 'POST',
                    'url': process.env.LOBSTER_POST_URL,
                    'headers': {
                        'Authorization': 'Basic QkxFU1NfVEVTVDpUMCNmIWI4PTVR',
                        'Content-Type': 'text/plain'
                    },
                    body: JSON.stringify(conMessage.tdata)
                };
                // this.logger.log(`Lobster Options is ${JSON.stringify(options)}`);
                var result = yield request(options, (error, response) => __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        throw new Error(error);
                    //Save response from Lobster system to exp_response table
                    this.logger.log("response----->", response.body);
                    var expResponse = yield this.ExpResponseDataRepository.update({ "customer_order_number": baseMessage.customer_order_number }, { "status": response.body, "token": token, "req_file_path": filePath, "req_file_uuid": fileName }); //, "request": JSON.stringify(options)
                    //this.logger.log("Response---->", expResponse)
                }));
                return token;
                //}
            }
            catch (error) {
                //Update processing_status of events table to ERROR
                console.log("Error----->", error);
                //await this.ExpResponseDataRepository.update({ "customer_order_number":baseMessage.customer_order_number }, { "status": "ERROR", "error_reason": error });
                bluebird_1.resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: error } });
            }
        });
    }
}
exports.DownStreamService = DownStreamService;
