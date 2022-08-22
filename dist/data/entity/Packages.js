"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packages = void 0;
const sequelize_1 = require("sequelize");
class Packages extends sequelize_1.Model {
    static initModel(sequelize) {
        return Packages.init({
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
            gross_weight: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            gross_weight_uom: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            length: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            length_uom: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            width: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            width_uom: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            height: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            height_uom: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            description: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'packages',
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
exports.Packages = Packages;
