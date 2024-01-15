import pool from "../database";
import dotenv from "dotenv";

dotenv.config();

export type Event = {
    eventID: Number,
    eventType: string,
    eventName: string,
    eventDate: Date,
    eventURL: string
}

export class Events {

    // Display all events
    async index(userEmail: string): Promise<string> {
        try{
            const conn = await pool.connect();
            const user_id = await conn.query("SELECT user_id FROM mrsm_users WHERE email = ($1);", [userEmail])
            if (user_id.rows.length === 0) {
                return "Something went wrong!";
            }
            
            const findUserId = user_id.rows[0].user_id;
            const sql = 'SELECT * FROM events WHERE user_id = ($1);';
            const result = await conn.query(sql, [findUserId]);
            conn.release();

            if(result.rows.length === 0){
                return "Add new event from /new/event"
            }
            
            return result.rows;
            } catch (err) {
                throw new Error(`${err}`);
            }
    }

    // Display specific event
    async show(userEmail: string, eventID: number): Promise<Event[] | string | null>{
        try{
            const conn = await pool.connect();
            const user_id = await conn.query("SELECT user_id FROM mrsm_users WHERE email = ($1);", [userEmail])
            if (user_id.rows.length === 0) {
                return "Something went wrong!";
            }
            
            const findUserId = user_id.rows[0].user_id;
            const sql = 'SELECT * FROM events WHERE user_id = ($1) AND eventID = ($2);';
            
            const result = await conn.query(sql, [findUserId, eventID]);
            if (result.rows.length === 0) {
                return `No event with the ID = ${eventID}`;
            }
            
            conn.release();
            return result.rows;
        } catch (err) {            
            throw new Error(`${err}`);
        }
    }

    // Create new event 
    async create(userEmail: string, event: Event): Promise<Array<Event> | string>{
        try{            
            const conn = await pool.connect();
            const user_id = await conn.query("SELECT user_id FROM mrsm_users WHERE email = ($1);", [userEmail])
            if (user_id.rows.length === 0) {
                return "Something went wrong!";
            }
            
            const findUserId = user_id.rows[0].user_id;
            // Test for duplicate id            
            const duplicateID = await conn.query("SELECT * FROM events WHERE eventID = ($1);", [event.eventID]); 
            if(duplicateID.rows[0] !== undefined) return 'Duplicate id';
            const sql = 'INSERT INTO events (eventID,user_id,eventType,eventName,eventDate,eventURL) VALUES ($1,$2,$3,$4,$5,$6);';
            const result = await conn.query(sql, [event.eventID, findUserId, event.eventType, event.eventName, event.eventDate, event.eventURL]);
            const eventData = [{
                eventID: event.eventID,
                eventType: event.eventType,
                eventName: event.eventName,
                eventDate: event.eventDate,
                eventURL: event.eventURL
            }]
            conn.release();
            return eventData;
        } catch (err) {
            throw new Error(`${err}`);
        }
    }
}