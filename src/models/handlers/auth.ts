import { NextFunction, Request , Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretToken : any = process.env.TOKEN_SECRET;

const authToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if(token == undefined) return res.status(401).json(`Invalid token`)


        jwt.verify(token, secretToken)

        next()
    } catch (err) {
        res.status(401)
        res.json(`Invalid token ${err}`)
    }
}

export default authToken;