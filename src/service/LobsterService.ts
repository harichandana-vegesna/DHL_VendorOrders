import { Logger } from "../logger/Logger";
import { DI } from '../di/DIContainer';
import { QueryBuilder } from "../util/QueryBuilder";
//import { GenericUtil } from "../util/GenericUtil";
//import { ExpResponseDataRepository } from "../data/repository/ExpResponseDataRepository";
//import { IMShipmentAnalyticsRepository } from "../data/repository/IMShipmentAnalyticsRepository";

// import * as fs from 'fs';
var transform = require("node-json-transform").transform;
import * as moment from 'moment';

export class LobsterService {
    private logger: Logger;
    // private LobsterRepository: LobsterRepository;

    constructor() {
        this.logger = DI.get(Logger);
        // this.LobsterRepository = DI.get(LobsterRepository);
    }


    async lobData(req: any, res?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('Request Body inside LobsterService', req)

                
                var today = new Date();
                var todayUTC = moment.utc(today).format("YYYY-MM-DD HH:mm:ss") + ' UTC'+moment.utc(today).format("Z")
                console.log("todayUTC",todayUTC)    
                var message = req
                console.log("DATA",message.content.accountNumber,message.content.HWAB,message.content.PrincipalreferenceNumber)
                // var baseMap = {
                //     "header": {
                //         "Transmission": {
                //             "toEntity": "Kalmar",
                //             "fromEntity": "EXP",
                //             "datacreationDate": todayUTC//"2022-06-29 06:21:57 UTC+02:00"
                //         },
                //         "businessKeys": {
                //             "accountNumber": message.content.accountNumber,
                //             "HWAB": message.content.HWAB,
                //             "PrincipalreferenceNumber": message.content.PrincipalreferenceNumber
                //         }
                //     },           
                //     "body" : {
                //         "documents": message.content.documents
                //     }               
                // }


                var baseMap = {
                    item : {
                        "header": "content",
                        "body": "content"
                    },
                    operate: [
                        {
                            run: function(val: any) { 
                                var today = new Date();
                                var todayUTC = moment.utc(today).format("YYYY-MM-DD HH:mm:ss") + ' UTC'+moment.utc(today).format("Z")
                                var _header = {
                                    "Transmission": {
                                        "toEntity": "Kalmar",
                                        "fromEntity": "EXP",
                                        "datacreationDate": todayUTC//"2022-06-29 06:21:57 UTC+02:00"
                                    },
                                    "businessKeys": {
                                        "accountNumber": message.content.accountNumber,
                                        "HWAB": message.content.HWAB,
                                        "PrincipalreferenceNumber": message.content.PrincipalreferenceNumber,
                                    }
                                }
                                return _header; 
                            },
                            on: "header"
                        },
                        {
                            run: function(val: any) { 
    
                                var _body = {
                                    "documents": message.content.documents
                                }
    
                                return _body; 
                            },
                            on: "body"
                        }
                    ]
                };
                    
                console.log("baseMap",baseMap)
    
                var tdata = transform(message, baseMap);

                console.log("tdata",tdata)
                //return { "status": "Ok", "message": tdata }
                         
                resolve({ "status": "Ok", "message": tdata  })

            } catch (e) {
                resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } })
            }
        })


    }

}