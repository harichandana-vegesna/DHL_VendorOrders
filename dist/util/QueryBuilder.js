"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
const sequelize_1 = require("sequelize");
class QueryBuilder {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    buildSortObj(sort) {
        let sortArrayOfArrays = [];
        for (let sortKey in sort) {
            sortArrayOfArrays.push([sortKey, sort[sortKey]]);
        }
        return sortArrayOfArrays;
    }
    buildColFilterObj(colFilters, colSearch) {
        let whereObj = {};
        let fullMessage;
        let status;
        let attributes;
        //ADD search condition to whereObj
        for (let colSearchKey in colSearch) {
            whereObj[colSearchKey] = { [sequelize_1.Op.like]: `%${colSearch[colSearchKey]}%` };
        }
        //Adding other conditions to where Obj
        for (let colFilterKey in colFilters) {
            let ColFiltervalue = colFilters[colFilterKey][0];
            if (typeof ColFiltervalue === "object") {
                for (let key in ColFiltervalue) {
                    let value = ColFiltervalue[key];
                    if (key.startsWith("DateBetween")) {
                        whereObj[colFilterKey] = { [sequelize_1.Op.between]: [new Date(value[0]), new Date(value[1])] };
                    }
                }
            }
            else if (colFilterKey === "fullMessage") {
                fullMessage = ColFiltervalue;
            }
            else if (colFilterKey === "status") {
                status = ColFiltervalue;
            }
            else if (colFilterKey === "attributes") {
                attributes = colFilters[colFilterKey];
            }
            else {
                whereObj[colFilterKey] = colFilters[colFilterKey];
            }
        }
        return { fullMessage: fullMessage, status: status, whereObj: whereObj, attributes: attributes };
    }
}
exports.QueryBuilder = QueryBuilder;
