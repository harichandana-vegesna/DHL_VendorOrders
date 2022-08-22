"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorBooking = void 0;
const sequelize_1 = require("sequelize");
class VendorBooking extends sequelize_1.Model {
    static initModel(sequelize) {
        return VendorBooking.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            customer_order_number: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            sequence_timestamp: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            planned_shipping_date_and_time: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            shipment_creation_date_time: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            order_status: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            shipment_inco_terms: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            commodity_code: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            commodity_text: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true
            },
            shipment_service_code: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            dangerous_goods: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            content_id: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            uncode: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            consignor_ref: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            hawb: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            response_error_code: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true
            },
            response_error_title: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            response_error_detail: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            response_time_stamp: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'vendor_booking',
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
exports.VendorBooking = VendorBooking;
