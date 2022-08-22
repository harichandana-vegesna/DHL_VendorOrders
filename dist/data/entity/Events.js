"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const sequelize_1 = require("sequelize");
class Events extends sequelize_1.Model {
    static initModel(sequelize) {
        return Events.init({
            id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            hawb: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            shipperId: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            event_code: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            event_type: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            event_desc: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            event_location: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            event_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            event_offset: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            processing_status: {
                type: sequelize_1.DataTypes.STRING(20),
                allowNull: true
            },
            error_reason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'events',
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
                    name: "idx_event_code",
                    using: "BTREE",
                    fields: [
                        { name: "event_code" },
                    ]
                },
                {
                    name: "idx_event_desc",
                    using: "BTREE",
                    fields: [
                        { name: "event_desc" },
                    ]
                },
                {
                    name: "idx_event_date",
                    using: "BTREE",
                    fields: [
                        { name: "event_date" },
                    ]
                },
            ]
        });
    }
}
exports.Events = Events;
