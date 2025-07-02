import express from 'express';
import { Request, Response } from 'express';
import colors from 'colors';

const app = express(); 

// Data object to simulate a database
const posts = {

}; 

app.get("/posts", (req: Request, res: Response) => {

}); 

app.post("/posts", (req: Request, res: Response) => {

}); 

app.listen(4000, () => {
    console.log( colors.blue.bold(`REST API working in port: 4000`))
})