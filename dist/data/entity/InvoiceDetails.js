"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceDetails = void 0;
const sequelize_1 = require("sequelize");
class InvoiceDetails extends sequelize_1.Model {
    static initModel(sequelize) {
        return InvoiceDetails.init({
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
            mwab: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            hawb: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            customerreference: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            typecode: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            uploadstatus: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            invoicenumber: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            invoicedate: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true
            },
            declaredvalue: {
                type: sequelize_1.DataTypes.DECIMAL(30, 7),
                allowNull: true
            },
            declaredvaluecurrency: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            incoterm: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            description: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            responseerrorcode: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true
            },
            responseerrortitle: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            responseerrordetail: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            responsetimestamp: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            additionalcharge: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true
            },
            additionalchargetype: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'invoice_details',
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
exports.InvoiceDetails = InvoiceDetails;
