import { Server } from "socket.io";
import { createClient } from "redis";
import { createServer } from "http";
import { handleDispatchedMessage } from "./dispatch_handler";

const PORT = 3000;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket has connected: " + socket.id);
  socket.join("channel:12345");
});

io.on("disconnect", (socket) => {
  console.log("Socket has disconnected: " + socket.id);
});

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

httpServer.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);

  await subClient.connect();
  console.log("Connected to Redis");
  await subClient.subscribe("_", (msg) => {
    // Handle dispatched messages from Redis
    handleDispatchedMessage(io, JSON.parse(msg));
  });
});
