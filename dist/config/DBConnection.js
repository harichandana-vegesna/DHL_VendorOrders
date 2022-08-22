"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const Sequelize = require("sequelize");
const Logger_1 = require("../logger/Logger");
const DIContainer_1 = require("../di/DIContainer");
class DBConnection {
    constructor() {
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
        this.logger.log('DB NAME', process.env.DB_NAME);
        this.connection = new Sequelize.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            define: {
                timestamps: false
            },
            logging: true
        });
        this.connection.authenticate().then(() => {
            this.logger.log('DB Connected');
        }, (error) => {
            this.logger.log('DB Not Connected', error);
        });
    }
}
exports.DBConnection = DBConnection;
