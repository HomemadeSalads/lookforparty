import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secretKey } from "../key.js";

export const getAuth = (req,res) =>{
    res.send("this is end point for auth.js")
};

// start here

export const register = (req,res) =>{
    //check user if exists
    const q = "SELECT * FROM player WHERE username = ?"
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        //if there exist an username
        if(data.length) return res.status(400).json("User already exist")

        //signup
        //hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password,salt);

        //insert account into db
        const q = "INSERT INTO player (`username`, `email`, `password`) VALUE (?)";
        db.query(q,[[req.body.username, req.body.email, hashedPassword]],(err,data =>{
            if(err) return res.status(500).json(err);

            const q = "SELECT * FROM player WHERE username = ?"
            db.query(q,[req.body.username],(err,data) =>{
                // find id
                if(err) return res.status(500).json(err);
                const id = data[0].id;

                // initialize bank
                const q = "INSERT INTO bank (`id`) VALUE (?)";
                db.query(q,[id],(err,data) =>{
                if(err) return res.status(500).json(err);})

                // initialize gear
                const b = "INSERT INTO gear (`id`) VALUE (?)";
                db.query(b,[id],(err,data) =>{
                if(err) return res.status(500).json(err);})
            })

            return res.status(200).json("User have been created")
        }));

    });

}

//login part
export const login = (req,res) =>{
    const q = "SELECT player.*, profilepic.link FROM player JOIN profilepic ON player.picId = profilepic.id WHERE username = (?)" ;
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        // fail to find username
        if(data.length === 0) return res.status(400).json("Wrong user or password");

        // comparepassword of request api to db password
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
        if(!checkPassword) return res.status(400).json("Wrong user or password");

        //include player.id to the accessToken to use at interface
        //use secretKey from key.js
        const token = jwt.sign({id:data[0].id}, secretKey);

        // return cookie and userinfo from data
        const { password, ...others } = data[0];

        res.cookie("accessToken",token,{
            httpOnly: true
        }).status(200).json(others);
    });
}

// logout clear cookie
export const logout = (req,res) =>{
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User have been logout");
}

