import { Server } from "socket.io";
import connectEvent from "./connect.event";

let eventCount = 0;

const logEventLoad = (event_name: string) => {
  eventCount++;
  console.log(`[${eventCount}] Loaded ${event_name} event handler`);
};

export const loadEventHandlers = (io: Server) => {
  connectEvent(io, () => logEventLoad("connection"));
  console.log(`Total event handlers loaded: ${eventCount}`);
};
