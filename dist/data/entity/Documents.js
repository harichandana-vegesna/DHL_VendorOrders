"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Documents = void 0;
const sequelize_1 = require("sequelize");
class Documents extends sequelize_1.Model {
    static initModel(sequelize) {
        return Documents.init({
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
            shiptrackingnum: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            typecode: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            path: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            label: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'documents',
            timestamps: false,
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
exports.Documents = Documents;
