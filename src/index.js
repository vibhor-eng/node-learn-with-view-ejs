// require('dotenv').config()
import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})


// import express from "express"
console.log("====== PORT",process.env.PORT)

app.get('/api/jokes', (req,res) => {
    const jokes = [

        {
            id:1,
            name:"vibhor",
            age:6
        },
        {
            id:2,
            name:"sultan",
            age:60
        },
        {
            id:3,
            name:"vaibhav",
            age:44
        },
        {
            id:4,
            name:"ruby",
            age:5
        }

    ];
    res.send(jokes);
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 4000, () =>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("mongo db connected !!! ",err)
})