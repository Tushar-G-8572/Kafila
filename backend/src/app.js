import express from 'express';
import { Server } from 'socket.io'; 
import http from 'http'
import tripRouter from './router/trip.route.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = http.createServer(app);

const io = new Server(httpServer,{
 cors:{
  origin:"*",
  methods:["GET","POST","PATCH"]
 }
})


io.on("connection", (socket) => {
    console.log("Client connected: " + socket.id);

    socket.on("data", (data) => {
        console.log("data",data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
    });
})

httpServer.use('/api/trip',tripRouter);


export default httpServer;