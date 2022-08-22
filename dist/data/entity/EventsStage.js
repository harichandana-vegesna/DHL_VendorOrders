"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsStage = void 0;
const sequelize_1 = require("sequelize");
class EventsStage extends sequelize_1.Model {
    static initModel(sequelize) {
        return EventsStage.init({
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
            hawb: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            event_type: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            event_code: {
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
            }
        }, {
            sequelize,
            tableName: 'events_stage',
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
                    name: "idx_parent_id",
                    using: "BTREE",
                    fields: [
                        { name: "parent_id" },
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
exports.EventsStage = EventsStage;
