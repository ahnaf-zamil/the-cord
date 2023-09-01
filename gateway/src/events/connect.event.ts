import { Server } from "socket.io";

export default (io: Server, callback: Function) => {
  io.on("connection", (socket) => {
    console.log(socket.handshake.auth.token);
    console.log("Socket has connected: " + socket.id);
  });

  io.on("disconnect", (socket) => {
    console.log("Socket has disconnected: " + socket.id);
  });
  callback();
};
