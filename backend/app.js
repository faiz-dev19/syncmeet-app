import express from "express";
import {createServer} from "node:http";

import {Server} from "socket.io";
import mongoose from "mongoose"; 
import { connectToSocket } from "./src/controllers/socketManager.js"; 
import cors from "cors";
import userRoutes from "./src/routes/users.routes.js";
 
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.Port || 8000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true})); 

app.use("/api/v1",userRoutes);

const start = async ()=>{
  app.set("mongo_user")
    const connectionDb = await mongoose.connect("mongodb+srv://faizmalik_123:xlEY8ifTiqaKjDfG@cluster0.1xwkk3v.mongodb.net/")
    console.log(`MONGO is Connected Host ${connectionDb.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("listening is start")
  });
}

start();