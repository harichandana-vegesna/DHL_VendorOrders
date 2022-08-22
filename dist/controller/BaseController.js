"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const express_1 = require("express");
class BaseController {
    getRouter() {
        const router = express_1.Router();
        router.get('/', (req, res) => {
            res.json({ status: 'ok', message: 'base controller path /' });
        });
        return router;
    }
}
exports.BaseController = BaseController;
