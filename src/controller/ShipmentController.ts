import { Controller } from "./Controller";
import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { Logger } from "../logger/Logger";
import { DI } from "../di/DIContainer";
// import { ShipmentService } from "../service/ShipmentService";
import { ExpTmsService } from "../service/ExpTmsService";
import { ExpResponseDataService } from "../service/ExpResponseDataService";
import { LobsterService } from "../service/LobsterService";
// import { AuthService } from "../service/AuthService";

var request = require('request');

export class ShipmentController implements Controller {
    private logger: Logger = DI.get(Logger)
    // private ShipmentService: ShipmentService = DI.get(ShipmentService)
    private ExpTmsService: ExpTmsService = DI.get(ExpTmsService)
    private ExpResponseDataService: ExpResponseDataService = DI.get(ExpResponseDataService)
    private LobsterService: LobsterService = DI.get(LobsterService)
    //private authService: AuthService = DI.get(AuthService)
    getRouter(): Router {
        const router = Router();

        router.post('/expResponse',async (req, res) => {
            try {

                var responseData, response;
                console.log("Request Body inside ShipmentController",req.body)

                //console.log("REQUEST",req.rawHeaders[1])

                responseData = await this.ExpTmsService.ExpDhl(req, res)
                console.log("Response in ShipmentController",responseData)

                response = await this.ExpResponseDataService.expResData(responseData, res)

                res.json({ status: { code: 'SUCCESS', message: "Created Successfully" }, data: response });
                
            } catch (error) {
                let response: any = { status: { code: 'FAILURE', message: error } }
                res.json(response);

            }
        });

    
        router.post('/expTmsData',async (req, res) => {
            try {

                var result;
                console.log("Request Body inside ShipmentController",req.body)

                result = await this.ExpTmsService.expTmsData(req.body,res)
               
                console.log("Response in ShipmentController",result)
                
                res.json({ status: { code: 'SUCCESS', message: "Created Successfully" }, data: result });
                


            } catch (error) {
                let response: any = { status: { code: 'FAILURE', message: "Error While Uploading The File" } }
                res.json(response);

            }
        });

        router.post('/lobsterData/:arg1',async (req, res) => {
            try {

                var expData, expResData, lobMessage;
                console.log("Request Body inside ShipmentController",req.params.arg1)

                //console.log("REQUEST",req.rawHeaders[1])
                let shipmentTrackingNumber = req.params.arg1
                //var shipmentTrackingNumber = req.body.shipmentTrackingNumber
                expData = await this.ExpTmsService.getexpTmsData(shipmentTrackingNumber, res)

               // console.log("Response in expData",expData.res.dataValues)
                var trsd = expData.res.dataValues.message
                console.log("Response in trsd",trsd.accounts[0].number, trsd.content.packages[0].customerReferences[0].value)
                expResData = await this.ExpResponseDataService.getexpResData(shipmentTrackingNumber, res)

                console.log("Response in ShipmentController",JSON.parse(expResData.res.dataValues.message))
                var resp = JSON.parse(expResData.res.dataValues.message)

                console.log("Response in resp",resp.shipmentTrackingNumber, resp.documents)

                var message = {
                    "content":{
                        "accountNumber": trsd.accounts[0].number,
                        "HWAB": resp.shipmentTrackingNumber,
                        "PrincipalreferenceNumber": trsd.content.packages[0].customerReferences[0].value,
                        "documents": resp.documents
                    }
                };

                console.log("MESSAGE", message)
                lobMessage = await this.LobsterService.lobData(message, res)
                console.log("LobMessage", lobMessage)
                res.json({lobdata: lobMessage });
                
            } catch (error) {
                let response: any = { status: { code: 'FAILURE', message: error } }
                res.json(response);

            }
        });


        return router;
    }


}