"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsRepository = void 0;
const init_models_1 = require("../entity/init-models");
const BaseRepository_1 = require("./BaseRepository");
class EventsRepository extends BaseRepository_1.BaseRepository {
    getModel() {
        return init_models_1.Events;
    }
}
exports.EventsRepository = EventsRepository;
