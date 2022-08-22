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
exports.LobsterService = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const ExpResponseDataRepository_1 = require("../data/repository/ExpResponseDataRepository");
const VendorBookingRepository_1 = require("../data/repository/VendorBookingRepository");
const AddressRepository_1 = require("../data/repository/AddressRepository");
const LobsterTransformationService_1 = require("./LobsterTransformationService");
const EventsToLobsterRepository_1 = require("../data/repository/EventsToLobsterRepository");
const EventsRepository_1 = require("../data/repository/EventsRepository");
var fs = require('fs');
var request = require('request');
class LobsterService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.expResponseDataRepository = DIContainer_1.DI.get(ExpResponseDataRepository_1.ExpResponseDataRepository);
        this.lobsterTransformationService = DIContainer_1.DI.get(LobsterTransformationService_1.LobsterTransformationService);
        this.addressRepository = DIContainer_1.DI.get(AddressRepository_1.AddressRepository);
        this.vendorBoookingRepository = DIContainer_1.DI.get(VendorBookingRepository_1.VendorBookingRepository);
        this.eventsToLobsterRepository = DIContainer_1.DI.get(EventsToLobsterRepository_1.EventsToLobsterRepository);
        this.eventsRepository = DIContainer_1.DI.get(EventsRepository_1.EventsRepository);
    }
    postTmsResponseToLobster() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    //Get all UNPROCESSED TMS Response Messages from exp_response_data table 
                    let tmsResponseList = yield this.expResponseDataRepository.get({ "status": "UNPROCESSED" });
                    //Loop the UNPROCESSED rows and submit to LOBSTER SYSTEM
                    for (let tmsReponseItem of tmsResponseList) {
                        var resp = JSON.parse(tmsReponseItem.dataValues.message);
                        var conMessage;
                        var resp = JSON.parse(tmsReponseItem.dataValues.message);
                        //Derive accountNumber to be sent to LOSTER system
                        let vendorOrderItem = (yield this.vendorBoookingRepository.get({ "customer_order_number": tmsReponseItem["customer_order_number"] }));
                        if (vendorOrderItem.length > 0) {
                            var id = vendorOrderItem[0]["id"];
                        }
                        else {
                            //Save Error Message to exp_response_data table
                            yield this.expResponseDataRepository.update({ "id": tmsReponseItem.id }, { "status": "ERROR", "error_reason": `No Vendor Booking Found with customer_order_number=${tmsReponseItem["customer_order_number"]}` });
                            continue;
                        }
                        let addressList = yield this.addressRepository.get({ "address_type": "consignor", "parent_id": id });
                        let accountNumber;
                        if (addressList.length > 0) {
                            accountNumber = addressList[0]["address_id"];
                        }
                        else {
                            accountNumber = "";
                        }
                        console.log(`Account Number is ${accountNumber}`);
                        var message = {
                            "content": {
                                "accountNumber": accountNumber,
                                "HAWB": resp.shipmentTrackingNumber,
                                "PrincipalreferenceNumber": tmsReponseItem["customer_order_number"],
                                "documents": resp.documents
                            }
                        };
                        //Removing extraneous fields in the error message
                        var errorBody = JSON.parse(tmsReponseItem.dataValues.message);
                        delete errorBody["instance"];
                        delete errorBody["message"];
                        var errorMessage = {
                            "content": {
                                "accountNumber": accountNumber,
                                "HAWB": resp.shipmentTrackingNumber,
                                "PrincipalreferenceNumber": tmsReponseItem["customer_order_number"],
                                "documents": resp.documents
                            },
                            "error": errorBody
                        };
                        //Construct final Loster POST message
                        if (tmsReponseItem.dataValues.statusCode == 201) {
                            conMessage = yield this.lobsterTransformationService.lobData(message);
                        }
                        else {
                            conMessage = yield this.lobsterTransformationService.lobData(errorMessage, true);
                        }
                        console.log("conMessage", conMessage);
                        var options = {
                            'method': 'POST',
                            'url': process.env.LOBSTER_POST_URL,
                            'headers': {
                                'Authorization': 'Basic QkxFU1NfVEVTVDpUMCNmIWI4PTVR',
                                'Content-Type': 'text/plain'
                            },
                            body: JSON.stringify(conMessage.tdata)
                        };
                        this.logger.log(`Lobster Options is ${JSON.stringify(options)}`);
                        var result = yield request(options, (error, response) => __awaiter(this, void 0, void 0, function* () {
                            if (error)
                                throw new Error(error);
                            //Save response from Lobster system to exp_response table
                            console.log("response----->", response.body);
                            var expResponse = yield this.expResponseDataRepository.update({ "id": tmsReponseItem.id }, { "status": response.body, "request": JSON.stringify(options) });
                            //console.log("Response---->", expResponse)
                        }));
                        resolve({ 'status': "Success" });
                    }
                }
                catch (error) {
                    //Update processing_status of events table to ERROR
                    yield this.expResponseDataRepository.update({ "id": id }, { "status": "ERROR", "error_reason": error });
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: error } });
                }
            }));
        });
    }
    postEventsToLobster() {
        return __awaiter(this, void 0, void 0, function* () {
            //Get Data from EVENTS_TO_LOBSTER View
            let evenntsDataToLobster = yield this.eventsToLobsterRepository.get({});
            let transformedEventsData;
            let options;
            let eventsUpdateObj;
            let eventsUpdateWhereObj;
            for (let evenntsDataToLobsterItem of evenntsDataToLobster) {
                try {
                    //Only Hawb should be enough as the events table will only contain the events that should be sent to LOBSTER System
                    eventsUpdateWhereObj = { "hawb": evenntsDataToLobsterItem["hawb"] };
                    eventsUpdateObj = { "processing_status": "SENT" };
                    transformedEventsData = yield this.lobsterTransformationService.transformEvents(evenntsDataToLobsterItem);
                    options = {
                        'method': 'POST',
                        'url': process.env.LOBSTER_POST_URL,
                        'headers': {
                            'Authorization': 'Basic QkxFU1NfVEVTVDpUMCNmIWI4PTVR',
                            'Content-Type': 'text/plain'
                        },
                        body: JSON.stringify(transformedEventsData)
                    };
                    this.logger.log(`Lobster Options is ${JSON.stringify(options)}`);
                    yield request(options, (error, response) => __awaiter(this, void 0, void 0, function* () {
                        if (error)
                            throw new Error(error);
                        //Update processing_status of events table to SENT
                        yield this.eventsRepository.update(eventsUpdateWhereObj, eventsUpdateObj);
                    }));
                }
                catch (error) {
                    //Update processing_status of events table to ERROR
                    eventsUpdateObj = { "processing_status": "ERROR", "error_reason": error };
                    yield this.eventsRepository.update(eventsUpdateWhereObj, eventsUpdateObj);
                }
            }
        });
    }
}
exports.LobsterService = LobsterService;
