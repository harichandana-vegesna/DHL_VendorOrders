"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItems = void 0;
const sequelize_1 = require("sequelize");
class LineItems extends sequelize_1.Model {
    static initModel(sequelize) {
        return LineItems.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            customerordernumber: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            serial_number: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            description: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            quantity_value: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            quantity_uom: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            commoditytype: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            commodityhscode: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            manufacturercountry: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            net_value: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            netvalue_uom: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            gross_value: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            grossvalue_uom: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'line_items',
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
exports.LineItems = LineItems;
