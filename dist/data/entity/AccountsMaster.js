"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsMaster = void 0;
const sequelize_1 = require("sequelize");
class AccountsMaster extends sequelize_1.Model {
    static initModel(sequelize) {
        return AccountsMaster.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            bill_toparty_account: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            shipper_account: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            consignee_account: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            account_description: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            rate_identifier: {
                type: sequelize_1.DataTypes.STRING(250),
                allowNull: true
            },
            business_unit: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            bless_identifier: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'accounts_master',
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
exports.AccountsMaster = AccountsMaster;
