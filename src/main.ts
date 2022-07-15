import express from 'express';
// import expressOasGenerator from 'express-oas-generator';
import cors from 'cors';
import dotenv from 'dotenv';
import { Logger } from './logger/Logger';
import { DBConnection } from './config/DBConnection';
//import {CronService} from './service/CronService'
import { BaseController } from './controller/BaseController';
// import {OperationalDataController} from './controller/OperationalDataController'
// import {CronController} from './controller/CronController'
// import {AnalyticsController} from './controller/AnalyticsController'
// import {IMShipmentAnalyticsController} from './controller/IMShipmentAnalyticsController'
//import {AuthController} from './controller/AuthController'
import {ShipmentController} from './controller/ShipmentController'
import { initModels } from './data/entity/init-models';
import { DI } from './di/DIContainer';
import { ErrorHandler } from './error/ErrorHandler';
import Keycloak from 'keycloak-connect';
import session, { MemoryStore } from 'express-session';
// import { ShipmentCostAnalyticsController } from './controller/ShipmentCostAnalyticsController';
// import { ShipmentRegionalCostAnalysisController } from './controller/ShipmentRegionalCostAnalysisController';
// import { EtaDeviationController } from './controller/EtaDeviationController';

// import { ImController } from './controller/ImController';

const expressApp: express.Application = express(); 
var bodyParser = require('body-parser');            
var cron = require('cron');
expressApp.use(bodyParser.json({limit:'500mb'})); 
expressApp.use(bodyParser.urlencoded({extended:true, limit:'500mb'})); 

var schedule = require('node-schedule');
var request = require('request');

const memoryStore = DI.get<MemoryStore>(MemoryStore);
const keycloak: Keycloak = DI.get(Keycloak, { store: memoryStore }, {
    clientId: process.env.KC_CLIENT_ID,
    bearerOnly: true,
    serverUrl: process.env.KC_HOST! + process.env.KC_AUTH_PATH!,
    realm: process.env.KC_REALM,
    "confidential-port": 0
});

dotenv.config();

class Main {
    private logger: Logger;
    private dbConnection: DBConnection;
    constructor() { 
        this.logger = DI.get(Logger);
        this.dbConnection = DI.get(DBConnection);
    }

    initializeApplication() {
        this.registerControllers();
        this.startServer();
        initModels(this.dbConnection.connection);
    }

    private initializeRepositories() {
    }

    private registerControllers() {
        const baseUrl = process.env.BASE_URL
            this.initializeRepositories();
            expressApp.use(session({
                secret: 'mySecret',
                resave: false,
                saveUninitialized: true,
                store: memoryStore
            }));
            expressApp.use(cors());
            expressApp.use(bodyParser.urlencoded({extended: true}));
            expressApp.use(bodyParser.json());
            expressApp.use(keycloak.middleware());
            expressApp.use((req, res, next) => {
                DI.destroy();
                next();
            })

            // expressApp.use(`${baseUrl}/auth`, DI.get<AuthController>(AuthController).getRouter());
            // expressApp.use(`${baseUrl}/transactions`,DI.get<OperationalDataController>(OperationalDataController).getRouter());
            // expressApp.use(`${baseUrl}/cron`,DI.get<CronController>(CronController).getRouter());
            // expressApp.use(`${baseUrl}`,DI.get<AnalyticsController>(AnalyticsController).getRouter());
            // expressApp.use(`${baseUrl}/shipments`,DI.get<IMShipmentAnalyticsController>(IMShipmentAnalyticsController).getRouter());
            // expressApp.use(`${baseUrl}/shipmentCostAnalytics`,DI.get<ShipmentCostAnalyticsController>(ShipmentCostAnalyticsController).getRouter());
            // expressApp.use(`${baseUrl}/shipmentRegionalCostAnalytics`,DI.get<ShipmentRegionalCostAnalysisController>(ShipmentRegionalCostAnalysisController).getRouter());
            // expressApp.use(`${baseUrl}/etaDeviation`,DI.get<EtaDeviationController>(EtaDeviationController).getRouter());
            
            // expressApp.use(`${baseUrl}/im`, DI.get<ImController>(ImController).getRouter());
            expressApp.use(DI.get<ErrorHandler>(ErrorHandler).errorHandler);

            expressApp.use(`/vendor`,DI.get<ShipmentController>(ShipmentController).getRouter());

    }
    

    private startServer() {
        expressApp.listen(process.env.PORT, () => {
            this.logger.log('Application Server Started',process.env.PORT);
        });
        // expressApp.listen(process.env.PORT, () => {
        //     this.logger.log('Application Server Started');
        //     let cronService: CronService = DI.get(CronService)
        //     var cronApis = cron.job("0 * * * *", async () => {              
        //         await cronService.gskCron();
        //         this.logger.log('cron Execution Success');


        //     });
        //     var nodeApis = cron.job("*/10  * * * *", async () => {
        //         await cronService.kafkaNodeSch();
        //         this.logger.log('Kafka Node Scheduler Execution Success');
        //     });
        //     if(process.env.IMCRON=="ON"){
        //         nodeApis.start();                
        //     }else if(process.env.IMCRON=="OFF"){
        //         nodeApis.stop();
        //     }
        //     if(process.env.AGGCRON=="ON"){
        //         cronApis.start();
        //     }else if(process.env.AGGCRON=="OFF"){
        //         cronApis.stop();
        //     }
            
        //     //nodeApis.start();
        //     //cronApis.start();
        // });
    }
}

const app = DI.get<Main>(Main);
app.initializeApplication();
function onComplete(arg0: string, onComplete: any) {
    throw new Error('Function not implemented.');
}

function elseif() {
    throw new Error('Function not implemented.');
}

