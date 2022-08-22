"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisationContact = void 0;
const sequelize_1 = require("sequelize");
class OrganisationContact extends sequelize_1.Model {
    static initModel(sequelize) {
        return OrganisationContact.init({
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
            address_id: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            phone: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            full_Name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'organisation_contact',
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
exports.OrganisationContact = OrganisationContact;
