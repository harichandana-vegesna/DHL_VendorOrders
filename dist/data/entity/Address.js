"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const sequelize_1 = require("sequelize");
class Address extends sequelize_1.Model {
    static initModel(sequelize) {
        return Address.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            parent_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            customer_order_number: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            address_id: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            address_type: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            line1: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true
            },
            line2: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true
            },
            city: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            state: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            zip: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            country_code: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            country_name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'address',
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
exports.Address = Address;
