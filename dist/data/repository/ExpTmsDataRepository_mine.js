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
exports.ExpTmsDataRepository = void 0;
const Logger_1 = require("../../logger/Logger");
const DIContainer_1 = require("../../di/DIContainer");
const init_models_1 = require("../entity/init-models");
class ExpTmsDataRepository extends Repository {
    constructor() {
        super();
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    get(whereObj) {
        return __awaiter(this, void 0, void 0, function* () {
            whereObj = (whereObj == undefined && whereObj == null) ? {} : whereObj;
            return yield new Promise((resolve, reject) => {
                init_models_1.ExpTmsData.findOne({
                    where: whereObj
                }).then((get) => {
                    resolve(get);
                }).catch((error) => {
                    this.logger.error(error);
                    reject(error);
                });
            });
        });
    }
    getAll(whereObj) {
        return __awaiter(this, void 0, void 0, function* () {
            whereObj = (whereObj == undefined && whereObj == null) ? {} : whereObj;
            return yield new Promise((resolve, reject) => {
                init_models_1.ExpTmsData.findAll({
                    where: whereObj
                }).then((get) => {
                    resolve(get);
                }).catch((error) => {
                    this.logger.error(error);
                    reject(error);
                });
            });
        });
    }
    create(obj, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                init_models_1.ExpTmsData.create(obj, { transaction }).then((created) => {
                    resolve(created);
                }).catch((error) => {
                    this.logger.error(error);
                    reject(error);
                });
            });
        });
    }
}
exports.ExpTmsDataRepository = ExpTmsDataRepository;
