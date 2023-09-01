import { Server } from "socket.io";

export default (io: Server, callback: Function) => {
  io.on("connection", (socket) => {
    console.log("Socket has connected: " + socket.id);
    socket.join("channel:12345");
  });

  io.on("disconnect", (socket) => {
    console.log("Socket has disconnected: " + socket.id);
  });
  callback();
};
