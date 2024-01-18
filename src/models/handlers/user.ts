import express, { Request , Response } from "express";
import { LoginUser, LoginModel } from "../login";
import { SignupUser, SignupModel } from "../signup";
import { check, validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

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

        if(result === "Please write the correct Email & Password") return res.status(400).json(`Please write the correct Email & Password`);
        const token = jwt.sign({user: result}, secretToken, { expiresIn: 1800 });
        res.cookie("token", token, {
            httpOnly: true
        })
        res.redirect("/events");
    } catch (err) {
        res.status(400).json(err);
    }
    
};

const loginPage = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public', 'login.html'));
};

const signup = async (_req: Request, res: Response) => {
    const user : SignupUser = {
        username: _req.body.username,
        email: _req.body.email,
        password: _req.body.password,
    }
    try{
        // Validate the inputs
        const errors = validationResult(_req);
        if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        const result = await userSignUp.create(user);

        // Duplicates
        if(result == "Email already exists") return res.status(400).json(`Email already exists`);
        if(result == "Username already exists") return res.status(400).json(`Username already exists`);

        
        const token = jwt.sign({user: result}, secretToken, { expiresIn: 1800 });
        res.cookie("token", token, {
            httpOnly: true
        })
        res.redirect("/events");
    } catch(err){
        res.status(400).json(err)
    }
};

const signupPage = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public', 'signup.html'));
};

const user_routes = (app: express.Application) => {
    app.get("/login", loginPage)
    app.get("/signup", signupPage)
    app.post("/login", login)
    app.post("/signup", [
        check("email", "Please provide a valid email! The correct format : info@info.com")
            .isEmail(),
        check("password", "Please write a password with at least 8 characters! and MUST contains 1 lowe case, 1 upper case, 1 number and 1 symbol")
            .isStrongPassword({minLength: 6})
    ], signup)
};

export default user_routes;