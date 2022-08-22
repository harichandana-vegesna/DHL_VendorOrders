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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Logger_1 = require("./logger/Logger");
const DBConnection_1 = require("./config/DBConnection");
const ShipmentController_1 = require("./controller/ShipmentController");
const init_models_1 = require("./data/entity/init-models");
const DIContainer_1 = require("./di/DIContainer");
const ErrorHandler_1 = require("./error/ErrorHandler");
const express_session_1 = __importStar(require("express-session"));
const DownStreamController_1 = require("./controller/DownStreamController");
const AuthController_1 = require("./controller/AuthController");
const ExpTmsService_1 = require("./service/ExpTmsService");
const LlpClien2Service_1 = require("./service/LlpClien2Service");
const LobsterService_1 = require("./service/LobsterService");
const multer = require('multer');
var upload = multer();
const expressApp = express_1.default();
var bodyParser = require('body-parser');
var cron = require('cron');
expressApp.use(bodyParser.json({ limit: '500mb' }));
expressApp.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
expressApp.use(upload.array());
var schedule = require('node-schedule');
var request = require('request');
const memoryStore = DIContainer_1.DI.get(express_session_1.MemoryStore);
dotenv_1.default.config();
class Main {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.dbConnection = DIContainer_1.DI.get(DBConnection_1.DBConnection);
    }
    initializeApplication() {
        this.registerControllers();
        this.startServer();
        init_models_1.initModels(this.dbConnection.connection);
    }
    initializeRepositories() {
    }
    registerControllers() {
        const baseUrl = process.env.BASE_URL;
        this.initializeRepositories();
        expressApp.use(express_session_1.default({
            secret: 'mySecret',
            resave: false,
            saveUninitialized: true,
            store: memoryStore
        }));
        expressApp.use(cors_1.default());
        expressApp.use(bodyParser.urlencoded({ extended: true }));
        expressApp.use(bodyParser.json());
        expressApp.use((req, res, next) => {
            DIContainer_1.DI.destroy();
            next();
        });
        expressApp.use(`${baseUrl}/auth`, DIContainer_1.DI.get(AuthController_1.AuthController).getRouter());
        expressApp.use(`${baseUrl}/out/bless-downstream`, DIContainer_1.DI.get(DownStreamController_1.DownStreamController).getRouter());
        expressApp.use(`${baseUrl}/vendor`, DIContainer_1.DI.get(ShipmentController_1.ShipmentController).getRouter());
        expressApp.use(DIContainer_1.DI.get(ErrorHandler_1.ErrorHandler).errorHandler);
    }
    startServer() {
        expressApp.listen(process.env.PORT, () => {
            this.logger.log('Application Server Started', process.env.PORT);
            let expTmsService = DIContainer_1.DI.get(ExpTmsService_1.ExpTmsService);
            let llpToClient2Service = DIContainer_1.DI.get(LlpClien2Service_1.LlpClien2Service);
            let lobsterService = DIContainer_1.DI.get(LobsterService_1.LobsterService);
            var llpToTms = cron.job(process.env.CRON1, () => __awaiter(this, void 0, void 0, function* () {
                yield expTmsService.ExpDhl();
                this.logger.log('cron Execution Success for LLP to TMS');
            }));
            var llpToClient2 = cron.job(process.env.CRON2, () => __awaiter(this, void 0, void 0, function* () {
                yield llpToClient2Service.clientTmsResponse();
                this.logger.log('cron Execution Success for LLP to CLIENT2');
            }));
            var client2ToLob = cron.job(process.env.CRON3, () => __awaiter(this, void 0, void 0, function* () {
                yield lobsterService.postTmsResponseToLobster();
                this.logger.log('cron Execution Success for CLIENT2 to Lobster');
            }));
            if (process.env.LLP_TMS_CRON == "ON") {
                llpToTms.start();
            }
            else if (process.env.LLP_TMS_CRON == "OFF") {
                llpToTms.stop();
            }
            if (process.env.LLP_CLIENT2_CRON == "ON") {
                llpToClient2.start();
            }
            else if (process.env.LLP_CLIENT2_CRON == "OFF") {
                llpToClient2.stop();
            }
            if (process.env.CLIENT2_LOBSTER_CRON == "ON") {
                client2ToLob.start();
            }
            else if (process.env.CLIENT2_LOBSTER_CRON == "OFF") {
                client2ToLob.stop();
            }
            //nodeApis.start();
            //cronApis.start();
        });
    }
}
const app = DIContainer_1.DI.get(Main);
app.initializeApplication();
function onComplete(arg0, onComplete) {
    throw new Error('Function not implemented.');
}
function elseif() {
    throw new Error('Function not implemented.');
}
