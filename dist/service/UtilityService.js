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
exports.UtilityService = void 0;
class UtilityService {
    isJsonString(val) {
        try {
            JSON.parse(val);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    //---------------------------Generatin vcid-----------------------//
    genVcid(sender, receiver, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { createHash } = require('crypto');
            var timeInMillSec = new Date().getTime();
            //generate random string
            var randomStr = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < 20; i++) {
                randomStr += characters.charAt(Math.floor(Math.random() *
                    charactersLength));
            }
            var vcIdStr = sender + "#" + appId + "#" + timeInMillSec + "#" + randomStr;
            const hash = createHash('sha256');
            hash.write(JSON.stringify(vcIdStr));
            vcIdStr = hash.digest('hex');
            return vcIdStr;
        });
    }
}
exports.UtilityService = UtilityService;
