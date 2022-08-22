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
exports.DataGenTransformationService = void 0;
///import { ForwardingRepository } from "../data/repository/ForwardingRepository";
const DIContainer_1 = require("../di/DIContainer");
const Logger_1 = require("../logger/Logger");
const AuthService_1 = require("./AuthService");
const UtilityService_1 = require("./UtilityService");
const ExpResponseDataRepository_1 = require("../data/repository/ExpResponseDataRepository");
//import { MawbMainRepository } from '../data/repository/MawbMainRepository';
const MessagingService_1 = require("./MessagingService");
const VendorBookingRepository_1 = require("../data/repository/VendorBookingRepository");
class DataGenTransformationService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.authService = DIContainer_1.DI.get(AuthService_1.AuthService);
        this.utilityService = DIContainer_1.DI.get(UtilityService_1.UtilityService);
        this.ExpResponseDataRepository = DIContainer_1.DI.get(ExpResponseDataRepository_1.ExpResponseDataRepository);
        this.MessagingService = DIContainer_1.DI.get(MessagingService_1.MessagingService);
        this.vendorBookingRepository = DIContainer_1.DI.get(VendorBookingRepository_1.VendorBookingRepository);
    }
    dataGenTransformation(msgType) {
        return __awaiter(this, void 0, void 0, function* () {
            let fianlPublishMessage;
            if (msgType === process.env.DATAGEN_TMS_RESP_MSG) {
                fianlPublishMessage = yield this.expTmsLlpClient2(msgType);
            } //Similary use cases to implement other DatagenMessage 
            console.log("fianlPublishMessage--------->", fianlPublishMessage);
            //Sending the Final Datagen messages Array to Message Service
            yield this.MessagingService.publishMessageToDataGen(fianlPublishMessage);
        });
    }
    //Transformation service to build TMS RESPONSE data which is intended to send from LLP to CLIENT2
    expTmsLlpClient2(msgType) {
        return __awaiter(this, void 0, void 0, function* () {
            var tmsResponseList = yield this.ExpResponseDataRepository.get({ 'status': "UNPROCESSED" });
            console.log("Unprocessed responses--->", tmsResponseList);
            console.log("msgType------->", msgType);
            //BLESS Datagen variables
            let messagePrimary = process.env.DATAGEN_TMS_RESP_PRIMARY_RECEIVER;
            let issuer = process.env.DATAGEN_TMS_RESP_SENDER;
            let BLESS_datagen_appId = process.env.DATAGEN_TMS_RESP_APP_ID;
            let fianlPublishMessage = [];
            let objJsonB64;
            let vendBkngItem;
            try {
                for (let tmsReponseItem of tmsResponseList) {
                    //Update the status in the response table of LLP to IN-PROGRESS. So that no other process picks the same record
                    //let tmsReponseItem = tmsResponseList[0]
                    this.logger.log("customer_order_number-------->", tmsReponseItem["customer_order_number"]);
                    //await this.ExpResponseDataRepository.update({ "customer_order_number":tmsReponseItem["customer_order_number"] }, { "status": "IN-PROGRESS" });
                    vendBkngItem = yield this.vendorBookingRepository.get({ "customer_order_number": tmsReponseItem["customer_order_number"] });
                    let objJsonStr = JSON.parse(JSON.stringify(tmsReponseItem));
                    //Adding Bless Identity Fields
                    objJsonStr['msgType'] = msgType;
                    objJsonStr["CustomerOrderNumber"] = vendBkngItem[0]["customer_order_number"];
                    objJsonStr["PlannedShippingDateTime"] = vendBkngItem[0]["planned_shipping_date_and_time"];
                    objJsonStr["ShipmentCreationDateTime"] = vendBkngItem[0]["shipment_creation_date_time"];
                    //console.log("objJsonStr------->", objJsonStr)
                    //Converting the response[i] to base64 formate
                    objJsonB64 = Buffer.from(JSON.stringify({ "body": objJsonStr })).toString("base64");
                    //console.log("objJsonB64------->", objJsonB64)
                    let publishMessage = {};
                    var vcId = yield this.utilityService.genVcid(issuer, messagePrimary, BLESS_datagen_appId);
                    //console.log("vcId----->", vcId)
                    publishMessage['receivers'] = {};
                    publishMessage['id'] = vcId;
                    publishMessage['msgType'] = process.env.DATAGEN_TMS_RESP_MSG;
                    publishMessage['audience'] = process.env.DATAGEN_TMS_RESP_AUDIENCE;
                    publishMessage['receivers']['primary'] = [messagePrimary];
                    publishMessage['receivers']['secondary'] = [];
                    publishMessage['primary'] = true;
                    publishMessage['applicationId'] = BLESS_datagen_appId;
                    publishMessage['sender'] = issuer;
                    publishMessage['issueTimeFLag'] = true;
                    publishMessage['payloads'] = [objJsonB64];
                    fianlPublishMessage.push(publishMessage);
                    //Update the status in the response table of LLP 
                    // this.logger.log("BEFORE UPDATE RES TABLE",tmsReponseItem["customer_order_number"])
                    const whereObj = { "customer_order_number": tmsReponseItem["customer_order_number"] };
                    const updateObj = { status: "PROCESSED" };
                    this.logger.log("AFTER DATAGEN RES TABLES---->", whereObj, updateObj);
                    yield this.ExpResponseDataRepository.update(whereObj, updateObj);
                }
                //console.log("fianlPublishMessage------->", fianlPublishMessage)
                return fianlPublishMessage;
            }
            catch (error) {
            }
        });
    }
}
exports.DataGenTransformationService = DataGenTransformationService;
