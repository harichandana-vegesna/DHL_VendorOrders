import { Logger } from "../logger/Logger";
import { DI } from '../di/DIContainer';
import { QueryBuilder } from "../util/QueryBuilder";
//import { GenericUtil } from "../util/GenericUtil";
import { ExpResponseDataRepository } from "../data/repository/ExpResponseDataRepository";
//import { IMShipmentAnalyticsRepository } from "../data/repository/IMShipmentAnalyticsRepository";

// import * as fs from 'fs';
const xlsxtojson = require("xlsx-to-json-lc");
import * as xlsx from 'xlsx';
import moment from "moment";
var multer = require('multer');
var uuid = require('uuid')
var fs = require('fs');


export class ExpResponseDataService {
    private logger: Logger;
    private ExpResponseDataRepository: ExpResponseDataRepository;

    constructor() {
        this.logger = DI.get(Logger);
        this.ExpResponseDataRepository = DI.get(ExpResponseDataRepository);
    }


    async expResData(req: any, res?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('Request Body inside ExpResponseDataService', req)

                var status = req.res.statusCode
                //console.log("Status",status)
                var data = req.res.data
                var data1 = JSON.parse(data)
                //console.log("DATA",data1)
                var shipmentTrackingNumber = data1.shipmentTrackingNumber
                var obj
                if (status == 201){
                    obj = {
                        statusCode: status,
                        status:"UNPROCESSED",
                        shipmentTrackingNumber:shipmentTrackingNumber,
                        message: data
                    }
                    
                }                
                console.log("Object",obj)
                var result = await this.ExpResponseDataRepository.create(obj); 
                console.log("Result",result)                           
                resolve({ res: result })

            } catch (e) {
                resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } })
            }
        })


    }

    async getexpResData(req: any, res?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let whereObj: any = {};
            try {
                console.log('Request Body inside ExpResponseDataService', req)
                whereObj['shipmentTrackingNumber'] = req;
                whereObj['status'] = "UNPROCESSED";
                let responseData: any = await this.ExpResponseDataRepository.get(whereObj);
                
                console.log("Result",responseData)                           
                resolve({ res: responseData })

            } catch (e) {
                resolve({ status: { code: 'FAILURE', message: "Error in FileFormat", error: e } })
            }
        })
    }

}