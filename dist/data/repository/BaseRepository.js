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
exports.BaseRepository = void 0;
const Logger_1 = require("../../logger/Logger");
const DIContainer_1 = require("../../di/DIContainer");
const sequelize_1 = require("sequelize");
class BaseRepository {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    getModel() {
        return sequelize_1.Model;
    }
    get(whereObj, attributes, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log("Attributes in Lines Get ", attributes);
            if (attributes !== null && attributes !== undefined) {
                return yield new Promise((resolve, reject) => {
                    this.getModel().findAll({ attributes: attributes, where: whereObj, transaction }).then((get) => {
                        resolve(get);
                    }).catch((error) => {
                        this.logger.error(error);
                        reject(error);
                    });
                });
            }
            else {
                return yield new Promise((resolve, reject) => {
                    this.getModel().findAll({ where: whereObj, transaction }).then((get) => {
                        resolve(get);
                    }).catch((error) => {
                        this.logger.error(error);
                        reject(error);
                    });
                });
            }
        });
    }
    getCount(whereObj, attributes, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getModel().count({ where: whereObj, transaction }).then((get) => {
                    resolve(get);
                }).catch((error) => {
                    this.logger.error(error);
                    reject(error);
                });
            });
        });
    }
    getByOrder(whereObj, orderBy, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getModel().findAll({ where: whereObj, order: orderBy, transaction }).then((get) => {
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
                this.getModel().create(obj, { transaction }).then((created) => {
                    resolve(created);
                }).catch((error) => {
                    this.logger.error(error);
                    reject(error);
                });
            });
        });
    }
    update(whereObj, updateObj, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.getModel().update(updateObj, { where: whereObj, transaction }).then((update) => {
                    resolve(update[0]);
                }).catch((error) => {
                    this.logger.error(error);
                    reject(error);
                });
            });
        });
    }
    updateOrCreate(obj, uniqueFieldsWhereObj, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundItem = false;
            if (Object.keys(uniqueFieldsWhereObj).length > 0) {
                foundItem = yield this.getModel().findOne({ where: uniqueFieldsWhereObj, transaction });
            }
            return yield new Promise((resolve, reject) => {
                let item = null;
                if (!foundItem) {
                    item = this.getModel().create(obj, { transaction });
                    resolve(item);
                }
                else {
                    item = this.getModel().update(obj, { where: uniqueFieldsWhereObj, transaction });
                    resolve(item);
                }
            });
        });
    }
}
exports.BaseRepository = BaseRepository;
