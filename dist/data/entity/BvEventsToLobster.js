"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BvEventsToLobster = void 0;
const sequelize_1 = require("sequelize");
class BvEventsToLobster extends sequelize_1.Model {
    static initModel(sequelize) {
        return BvEventsToLobster.init({
            id: {
                type: sequelize_1.DataTypes.BLOB,
                allowNull: true,
                primaryKey: true
            },
            hawb: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            shipperId: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            customerOrderNumber: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            events: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'BV_EVENTS_TO_LOBSTER',
            timestamps: true,
            paranoid: true
        });
    }
}
exports.BvEventsToLobster = BvEventsToLobster;
