"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpTmsDataRepository = void 0;
const ExpTmsData_1 = require("../entity/ExpTmsData");
const BaseRepository_1 = require("./BaseRepository");
class ExpTmsDataRepository extends BaseRepository_1.BaseRepository {
    getModel() {
        return ExpTmsData_1.ExpTmsData;
    }
}
exports.ExpTmsDataRepository = ExpTmsDataRepository;
