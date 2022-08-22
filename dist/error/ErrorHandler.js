"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const BaseResponse_1 = require("../response/BaseResponse");
const DIContainer_1 = require("../di/DIContainer");
const Logger_1 = require("../logger/Logger");
class ErrorHandler extends Error {
    errorHandler(err, req, res, next) {
        const logger = DIContainer_1.DI.get(Logger_1.Logger);
        const responseStatus = new BaseResponse_1.ResponseStatus(BaseResponse_1.ResponseCode.FAILURE, err.message);
        logger.error('Error Message: ', err.message);
        logger.error('Error Name: ', err.name);
        logger.error('Error Stack: ', err.stack);
        res.json(new BaseResponse_1.BaseResponse(responseStatus));
    }
}
exports.ErrorHandler = ErrorHandler;
