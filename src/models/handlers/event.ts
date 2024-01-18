import express, { Request , Response } from "express";
import { Event, Events } from "../event";
import dotenv from "dotenv";
import authToken from "./auth";
import path from "path";

dotenv.config();

const eventMethods = new Events();

const index = async (_req: Request, res: Response) => {  
    const userEmail = _req.user.user.email;
    const result = await eventMethods.index(userEmail);
    
    res.json(result);
};

const createEventPage = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public', '/new/event.html'));
};

const show = async (_req: Request, res: Response) => {
    const userEmail = _req.user.user.email;  
    try{
        const eventID = parseInt(_req.params.eventID);
        const result = await eventMethods.show(userEmail, eventID);
        if(result == undefined){
            return res.json(`No result for any event by the ID = ${eventID}`)
        }
        
        res.json(result);
    } catch (err) {
        res.status(400).json(err);
    }
    
};

const create = async (_req: Request, res: Response) => {
    const userEmail = _req.user.user.email;  
    const event : Event = {
        eventType: _req.body.eventType,
        eventName: _req.body.eventName,
        eventDate: _req.body.eventDate,
        eventURL: _req.body.eventURL
    }
    try{
        const result = await eventMethods.create(userEmail, event);
        res.json({status: "Successful!", result: result});
    } catch(err){
        res.status(400).json(err)
    }
};

const event_routes = (app: express.Application) => {
    app.get("/events", authToken , index)
    app.get("/event/:eventID", authToken , show)
    app.get("/new/event", authToken, createEventPage)
    app.post("/new/event", authToken, create)
};

export default event_routes;