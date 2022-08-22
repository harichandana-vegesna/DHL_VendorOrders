"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpResponseDataRepository = void 0;
const ExpResponseData_1 = require("../entity/ExpResponseData");
const BaseRepository_1 = require("./BaseRepository");
class ExpResponseDataRepository extends BaseRepository_1.BaseRepository {
    getModel() {
        return ExpResponseData_1.ExpResponseData;
    }
}
exports.ExpResponseDataRepository = ExpResponseDataRepository;
