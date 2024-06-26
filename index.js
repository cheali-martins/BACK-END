// old way of importing
// const express = require('express')



// new way of importing
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserRoute from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import PostRoute from "./routes/postRoutes.js";
import cors from 'cors';

dotenv.config();

// express is what entirely builds the server for us while node is what calls up the server
const app = express()

// this tells the express server how to interprete our request response. so what we see as object is what express sees as a json
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
})
);
app.use(cookieParser());

// you can change the 'app' to any word
const port = process.env.port;
const db = process.env.DATABASE_URL;


// This is just to test our server
app.get('/', (req, res) => {
    res.send('Hello World cohort 2 class wednesday')
});

// our other routes server
app.use("/user", UserRoute);
app.use("/post", PostRoute);

// note that the port number can be changed


// connecting the database to our server. Note that this is a promise.
mongoose.connect(db).then(() => {
    console.log("The database connected successfully");

    // its not right for the server to run before the database connects, it will cause a crash

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

}).catch(() => {
    console.log("database connection failed");
})


// console.log("the server is on");