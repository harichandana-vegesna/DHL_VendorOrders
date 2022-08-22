"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const kafkajs_1 = require("kafkajs");
const DIContainer_1 = require("../di/DIContainer");
const Logger_1 = require("../logger/Logger");
class MessagingService {
    constructor() {
        this.kafkav = new kafkajs_1.Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: ['kafka-1:19092', 'kafka-2:29092', 'kafka-3:39092', 'kafka-4:19092', 'kafka-5:29092']
        });
        this.logger = DIContainer_1.DI.get(Logger_1.Logger);
    }
    ///////---Publishing to DATAGEN-------/////////
    publishMessageToDataGen(messageList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(messageList)) {
                messageList = [messageList];
            }
            for (let message of messageList) {
                this.logger.log("================================START-DATAGEN MESSAGE PUBLISH==================", message);
                this.logger.log("Datagen Message ", message);
                this.logger.log("Topic name ", process.env.PUBLISH_TOPIC);
                this.logger.log("payloads ", message.payloads);
                const producer = this.kafkav.producer();
                yield producer.connect();
                let blessToken = yield producer.send({
                    topic: process.env.PUBLISH_TOPIC,
                    messages: [
                        {
                            value: JSON.stringify(message)
                        }
                    ]
                });
                this.logger.log(`BLESS TOKEN is ${JSON.stringify(blessToken)}`);
                this.logger.log("================================STOP-DATAGEN MESSAGE PUBLISH==================");
            }
        });
    }
}
exports.MessagingService = MessagingService;
