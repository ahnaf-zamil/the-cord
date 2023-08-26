import { Server } from "socket.io";
import { createServer } from "http";
import { handleDispatchedMessage } from "./dispatch_handler";
import { connect, StringCodec } from "nats";
import natsConfig from "./config/nats.config";

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

httpServer.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);

  // Creating NATS subscriber and listening for messages
  const nc = await connect({ servers: natsConfig.SERVERS });
  const sc = StringCodec();

  const sub = nc.subscribe("_");
  for await (const msg of sub) {
    // Passing message to dispatch handler
    handleDispatchedMessage(io, JSON.parse(sc.decode(msg.data)));
  }
});
