"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUsers = void 0;
const sequelize_1 = require("sequelize");
class AppUsers extends sequelize_1.Model {
    static initModel(sequelize) {
        return AppUsers.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            email_id: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false,
                unique: "emailid"
            },
            password: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false
            },
            user_type: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false
            },
            user_id: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true,
                unique: "userid"
            },
            user_org: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            user_role: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            organiation_type: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            creation_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true
            },
            last_update_date: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'app_users',
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
                {
                    name: "emailid",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "email_id" },
                    ]
                },
                {
                    name: "userid",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "user_id" },
                    ]
                },
            ]
        });
    }
}
exports.AppUsers = AppUsers;
