import { Server } from "socket.io";
import { createServer } from "http";
import { handleDispatchedMessage } from "./dispatch_handler";
import { connect, StringCodec } from "nats";
import natsConfig from "./config/nats.config";
import { loadEventHandlers } from "./events";
import { getDatabaseClient } from "./lib/db";

const PORT = 3000;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Loading event handlers
loadEventHandlers(io);

httpServer.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);

  const dbClient = await getDatabaseClient();
  // Creating NATS subscriber and listening for messages
  const nc = await connect({ servers: natsConfig.SERVERS });
  const sc = StringCodec();

  const sub = nc.subscribe("_");
  for await (const msg of sub) {
    // Passing message to dispatch handler
    handleDispatchedMessage(io, JSON.parse(sc.decode(msg.data)));
  }
  await dbClient.end();
});
