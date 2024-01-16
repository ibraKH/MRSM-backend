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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Events {
    // Display all events
    index(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const user_id = yield conn.query("SELECT user_id FROM mrsm_users WHERE email = ($1);", [userEmail]);
                if (user_id.rows.length === 0) {
                    return "Something went wrong!";
                }
                const findUserId = user_id.rows[0].user_id;
                const sql = 'SELECT * FROM events WHERE user_id = ($1);';
                const result = yield conn.query(sql, [findUserId]);
                conn.release();
                if (result.rows.length === 0) {
                    return "Add new event from /new/event";
                }
                return result.rows;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
    // Display specific event
    show(userEmail, eventID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const user_id = yield conn.query("SELECT user_id FROM mrsm_users WHERE email = ($1);", [userEmail]);
                if (user_id.rows.length === 0) {
                    return "Something went wrong!";
                }
                const findUserId = user_id.rows[0].user_id;
                const sql = 'SELECT * FROM events WHERE user_id = ($1) AND eventID = ($2);';
                const result = yield conn.query(sql, [findUserId, eventID]);
                if (result.rows.length === 0) {
                    return `No event with the ID = ${eventID}`;
                }
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
    // Create new event 
    create(userEmail, event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const user_id = yield conn.query("SELECT user_id FROM mrsm_users WHERE email = ($1);", [userEmail]);
                if (user_id.rows.length === 0) {
                    return "Something went wrong!";
                }
                const findUserId = user_id.rows[0].user_id;
                // Test for duplicate id            
                const duplicateID = yield conn.query("SELECT * FROM events WHERE eventID = ($1);", [event.eventID]);
                if (duplicateID.rows[0] !== undefined)
                    return 'Duplicate id';
                const sql = 'INSERT INTO events (eventID,user_id,eventType,eventName,eventDate,eventURL) VALUES ($1,$2,$3,$4,$5,$6);';
                const result = yield conn.query(sql, [event.eventID, findUserId, event.eventType, event.eventName, event.eventDate, event.eventURL]);
                const eventData = [{
                        eventID: event.eventID,
                        eventType: event.eventType,
                        eventName: event.eventName,
                        eventDate: event.eventDate,
                        eventURL: event.eventURL
                    }];
                conn.release();
                return eventData;
            }
            catch (err) {
                throw new Error(`${err}`);
            }
        });
    }
}
exports.Events = Events;
