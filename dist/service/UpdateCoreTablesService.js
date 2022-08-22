"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UpdateCoreTablesService = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const VendorBookingRepository_1 = require("../data/repository/VendorBookingRepository");
const DocumentRepository_1 = require("../data/repository/DocumentRepository");
const moment = __importStar(require("moment"));
var fs = require('fs');
var request = require('request');
class UpdateCoreTablesService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.vendorBoookingRepository = DIContainer_1.DI.get(VendorBookingRepository_1.VendorBookingRepository);
        this.documentRepository = DIContainer_1.DI.get(DocumentRepository_1.DocumentRepository);
    }
    //UPDATE TMS RESPONE IN CORE TABLES//
    updateTmsResCoreTables(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log("Request Body in updateTmsResCoreTables---->",req)
                var jsonObj = JSON.parse(req.message);
                console.log("Test----->", JSON.parse(req.message));
                var today = new Date();
                var todayUTC = moment.utc(today).format("YYYY-MM-DD HH:mm:ss") + ' UTC' + moment.utc(today).format("Z");
                var whereObj = { "customer_order_number": req.customer_order_number };
                console.log("req.customer_order_number", req.statusCode, req.customer_order_number, req.shipmentTrackingNumber);
                var vendorBookingObj;
                //Update VendorBooking Table based on Error/Success status
                if (req.statusCode == 201) {
                    vendorBookingObj = {
                        "order_status": process.env.VEN_BOOKING_CON_STATUS,
                        "hawb": req.shipmentTrackingNumber,
                        "response_time_stamp": todayUTC
                    };
                    console.log("vendorBookingObj--->", vendorBookingObj);
                    var vendorBookingObjSuc = yield this.vendorBoookingRepository.update(whereObj, vendorBookingObj);
                    //Update Documents Table
                    var documentsObj = {
                        customerordernumber: req.customer_order_number,
                        shiptrackingnum: req.shipmentTrackingNumber,
                        typecode: jsonObj.documents[0].typeCode,
                        label: jsonObj.documents[0].content
                    };
                    console.log("DOCUMENT---->", documentsObj);
                    yield this.documentRepository.create(documentsObj);
                }
                else {
                    vendorBookingObj = {
                        "order_status": process.env.VEN_BOOKING_ERR_STATUS,
                        "response_error_code": jsonObj.status,
                        "response_error_title": jsonObj.title,
                        "response_error_detail": (jsonObj.additionalDetails != undefined) ? jsonObj.detail + "," + "[" + jsonObj.additionalDetails + "]" : jsonObj.detail,
                        "response_time_stamp": todayUTC
                    };
                    console.log("vendorBookingObj--->", vendorBookingObj);
                    var vendorBookingObjErr = yield this.vendorBoookingRepository.update(whereObj, vendorBookingObj);
                }
            }
            catch (error) {
                console.log("Error in Updatetables---->", error);
                throw error;
            }
        });
    }
}
exports.UpdateCoreTablesService = UpdateCoreTablesService;
