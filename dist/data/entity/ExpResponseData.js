"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpResponseData = void 0;
const sequelize_1 = require("sequelize");
class ExpResponseData extends sequelize_1.Model {
    static initModel(sequelize) {
        return ExpResponseData.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            message: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false
            },
            shipmentTrackingNumber: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            token: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            customer_order_number: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            statusCode: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            error_reason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            req_file_path: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            req_file_uuid: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            parent_uuid: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'exp_response_data',
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
exports.ExpResponseData = ExpResponseData;
