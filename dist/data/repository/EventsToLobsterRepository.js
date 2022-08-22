"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsToLobsterRepository = void 0;
const init_models_1 = require("../entity/init-models");
const BaseRepository_1 = require("./BaseRepository");
class EventsToLobsterRepository extends BaseRepository_1.BaseRepository {
    getModel() {
        return init_models_1.BvEventsToLobster;
    }
}
exports.EventsToLobsterRepository = EventsToLobsterRepository;
