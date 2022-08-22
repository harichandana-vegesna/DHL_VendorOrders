"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigEventsToLobster = void 0;
const sequelize_1 = require("sequelize");
class ConfigEventsToLobster extends sequelize_1.Model {
    static initModel(sequelize) {
        return ConfigEventsToLobster.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            event_code: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            event_description: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'config_events_to_lobster',
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
exports.ConfigEventsToLobster = ConfigEventsToLobster;
