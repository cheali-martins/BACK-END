// old way of importing
// const express = require('express')



// new way of importing
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserRoute from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import PostRoute from "./routes/postRoutes.js"

dotenv.config();


const app = express()

app.use(express.json());
app.use(cookieParser());

// you can change the 'app' to any word
const port = process.env.port;
const db = process.env.DATABASE_URL;



app.get('/', (req, res) => {
    res.send('Hello World cohort 2 class wednesday')
});

// our other routes server
app.use("/user", UserRoute);
app.use("/post", PostRoute);

// note that the port number can be changed


// connecting the database to our server
mongoose.connect(db).then(() => {
    console.log("the database connected successfully");

    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });

}).catch(() => {
    console.log("database connection failed");
})


// console.log("the server is on");