"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpTmsData = void 0;
const sequelize_1 = require("sequelize");
class ExpTmsData extends sequelize_1.Model {
    static initModel(sequelize) {
        return ExpTmsData.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            message: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true
            },
            shipment_Tracking_Number: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            token: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            uuid: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true
            },
            customer_order_number: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'exp_tms_data',
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        });
    }
}
exports.ExpTmsData = ExpTmsData;
