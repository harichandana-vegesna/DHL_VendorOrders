"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseCode = exports.ResponseStatus = exports.BaseResponse = void 0;
class BaseResponse {
    constructor(status) {
        this.status = new ResponseStatus(ResponseCode.WARNING, 'Response Status Not Changed');
        this.status = status !== undefined && status !== null ? status : this.status;
    }
}
exports.BaseResponse = BaseResponse;
class ResponseStatus {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
exports.ResponseStatus = ResponseStatus;
var ResponseCode;
(function (ResponseCode) {
    ResponseCode["SUCCESS"] = "SUCCESS";
    ResponseCode["WARNING"] = "WARNING";
    ResponseCode["FAILURE"] = "FAILURE";
})(ResponseCode = exports.ResponseCode || (exports.ResponseCode = {}));
