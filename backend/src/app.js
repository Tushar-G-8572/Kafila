import express from 'express';
import { Server } from 'socket.io'; 
import http from 'http'
import passport from 'passport';
import './config/passport.config.js';
import authRouter from './router/auth.route.js'
import tripRouter from './router/trip.route.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());

const httpServer = http.createServer(app);

const io = new Server(httpServer,{
 path: "/api/socket.io",
 cors:{
  origin:"*",
  methods:["GET","POST","PATCH"]
 }
})


io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);

  socket.on("join-room", (groupId) => {
    socket.join(groupId);
    socket.groupId = groupId;
    console.log(`${socket.id} joined room ${groupId}`);
  });

  socket.on("location-update", ({ groupId, userId, lat, lng }) => {
    // sender ko chhod ke room ke baaki sab ko bhejo
    socket.to(groupId).emit("rider-location", { userId, lat, lng });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

app.use('/api/trip',tripRouter);

app.use('/api/auth',authRouter);

export { io };

export default httpServer;