import express from 'express';
import cors from "cors"; 
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { randomBytes } from 'crypto'; 
import axios from 'axios';

const app = express(); 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Logs
app.use(morgan("dev"));

// CORS setup
app.use(cors()); 

// Data object to simulate a database
const posts = {}; 

app.get("/posts", (req: Request, res: Response) => {
    res.send(posts); 
}); 

app.post("/posts", async (req: Request, res: Response) => {
    const id = randomBytes(4).toString("hex"); 

    const { title, content } = req.body; 

    posts[id] = { 
        id, 
        title, 
        content
    }; 

    await axios.post("http://localhost:4005/events", {
        type: "PostCreated", 
        data: {
            id, 
            title, 
            content
        }
    }).catch((error) => {
        return res.status(500).json({ message: "Error sending event to event bus", error: error.message})
    })

    res.status(201).send(posts[id]); 
    return
}); 

// Receiving Events from the event bus
app.post("/events", async (req: Request, res: Response) => {
    console.log("received event", colors.blue(req.body.type)); 
    
    res.send({}); // Acknowledge the event
})

app.listen(4000, () => {
    console.log( colors.blue.bold(`REST API working in port: 4000`))
})