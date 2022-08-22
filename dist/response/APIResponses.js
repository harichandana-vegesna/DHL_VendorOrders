"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchResponse = exports.CreatedResponse = void 0;
const BaseResponse_1 = require("./BaseResponse");
class CreatedResponse extends BaseResponse_1.BaseResponse {
    constructor(status, createdId) {
        super(status);
        this.createId = createdId;
    }
}
exports.CreatedResponse = CreatedResponse;
class FetchResponse extends BaseResponse_1.BaseResponse {
    // totalRowsCount: number;
    // filteredRowsCount: number;
    // graphResult:any;
    constructor(status, messageResult) {
        super(status);
        this.messageResult = messageResult;
        //     this.totalRowsCount = totalRowsCount;
        //     this.filteredRowsCount = filteredRowsCount;
        // this.graphResult = graphResult;
    }
}
exports.FetchResponse = FetchResponse;
