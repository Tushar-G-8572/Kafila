import { io } from "socket.io-client";

const socket = io("/", {
  path: "/api/socket.io",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Socket error:", error.message);
});

export default socket;