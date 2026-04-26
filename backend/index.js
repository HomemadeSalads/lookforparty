// import module
import express from "express"
import mysql from "mysql2"
import cors from "cors"
import cookieParser from "cookie-parser"

// import route
import userRoute from "./routes/userR.js"
import postRoute from "./routes/postR.js"
import authRoute from "./routes/authR.js"

// setup
const app = express();

// db connection for bookstore legacy testing purpose
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"test"
});

//middleware
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next();
});
app.use(express.json());

// multiplexer for api request test true for frontend only
true ? app.use(
    cors({
       origin: "http://localhost:3000"
    })):app.use(cors())

app.use(cookieParser());

// end of setup

app.get("/",(req,res)=>{
    res.json("hello this is the backend")
})

// router setup
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);


app.listen(8800, ()=> {
    console.log("Connected to backend yessssir")
})