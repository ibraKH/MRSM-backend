import express, { Request , Response } from "express";
import { LoginUser, LoginModel } from "../login";
import { SignupUser, SignupModel } from "../signup";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userLogin = new LoginModel();
const userSignUp = new SignupModel();


const secretToken : any = process.env.TOKEN_SECRET;


const login = async (_req: Request, res: Response) => {
    const user : LoginUser = {
        email: _req.body.email,
        password: _req.body.password,
    }
    try{
        const result = await userLogin.authenticate(user);     

        const token = jwt.sign({user: result}, secretToken);
        res.cookie("token", token, {
            httpOnly: true
        })
        res.redirect("/events");
    } catch (err) {
        res.status(400).json(err);
    }
    
};

const signup = async (_req: Request, res: Response) => {
    const user : SignupUser = {
        username: _req.body.username,
        email: _req.body.email,
        password: _req.body.password,
    }
    try{
        const result = await userSignUp.create(user);

        // Duplicates
        if(result == "Email already exists") return res.status(400).json(`Email already exists`);
        if(result == "Username already exists") return res.status(400).json(`Username already exists`);

        
        const token = jwt.sign({user: result}, secretToken);
        res.cookie("token", token, {
            httpOnly: true
        })
        res.redirect("/events");
    } catch(err){
        res.status(400).json(err)
    }
};

const user_routes = (app: express.Application) => {
    app.post("/login", login)
    app.post("/signup", signup)
};

export default user_routes;