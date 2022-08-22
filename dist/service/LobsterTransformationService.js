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
exports.LobsterTransformationService = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
var transform = require("node-json-transform").transform;
const moment = __importStar(require("moment"));
class LobsterTransformationService {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    lobData(message, isError) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    //console.log('Request Body inside LobsterTransformationService', req)    
                    var baseMap = {
                        item: {
                            "header": "content",
                            "body": "content"
                        },
                        operate: [
                            {
                                run: function (val) {
                                    var today = new Date();
                                    var todayUTC = moment.utc(today).format("YYYY-MM-DD HH:mm:ss") + ' UTC' + moment.utc(today).format("Z");
                                    var _header = {
                                        "Transmission": {
                                            "toEntity": "Kalmar",
                                            "fromEntity": "EXP",
                                            "datacreationDate": todayUTC //"2022-06-29 06:21:57 UTC+02:00"
                                        },
                                        "businessKeys": {
                                            "accountNumber": message.content.accountNumber,
                                            "HAWB": message.content.HAWB,
                                            "PrincipalreferenceNumber": message.content.PrincipalreferenceNumber,
                                            "estimatedDeliveryDate": message.content.estimatedDeliveryDate
                                        }
                                    };
                                    return _header;
                                },
                                on: "header"
                            },
                            {
                                run: function (val) {
                                    var body;
                                    if (isError) {
                                        body = {
                                            "Error": [message.error]
                                        };
                                    }
                                    else {
                                        body = {
                                            "documents": message.content.documents
                                        };
                                    }
                                    return body;
                                },
                                on: "body"
                            }
                        ]
                    };
                    //console.log("baseMap",baseMap)
                    var tdata = transform(message, baseMap);
                    console.log("tdata----->\n\n", tdata);
                    resolve({ tdata });
                }
                catch (e) {
                    resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } });
                }
            }));
        });
    }
    transformEvents(message, res, isError) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    var baseMap = {
                        item: {
                            "header": "content",
                            "body": "content"
                        },
                        operate: [
                            {
                                run: function (val) {
                                    var today = new Date();
                                    var todayUTC = moment.utc(today).format("YYYY-MM-DD HH:mm:ss") + ' UTC' + moment.utc(today).format("Z");
                                    var _header = {
                                        "Transmission": {
                                            "toEntity": "Kalmar",
                                            "fromEntity": "EXP",
                                            "datacreationDate": todayUTC //"2022-06-29 06:21:57 UTC+02:00"
                                        },
                                        "businessKeys": {
                                            "accountNumber": message.shipperId,
                                            "HAWB": message.hawb,
                                            "PrincipalreferenceNumber": message.customerOrderNumber,
                                        }
                                    };
                                    return _header;
                                },
                                on: "header"
                            },
                            {
                                run: function (val) {
                                    var body = {
                                        "Events": message.events
                                    };
                                    return body;
                                },
                                on: "body"
                            }
                        ]
                    };
                    resolve(yield transform(message, baseMap));
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
}
exports.LobsterTransformationService = LobsterTransformationService;
