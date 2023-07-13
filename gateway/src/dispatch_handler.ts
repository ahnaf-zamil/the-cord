import { Server } from "socket.io";

interface TDispatchedMessage {
  content: any;
  scope: number;
  ev_type: string;
  data: any;
}

const handleUserScope = (io: Server, msg: TDispatchedMessage) => {
  // Unimplemented
};

const handleGuildScope = (io: Server, msg: TDispatchedMessage) => {
  // Unimplemented
};

const handleChannelScope = (io: Server, msg: TDispatchedMessage) => {
  /* Dispatches messages to channel scope */
  io.to(`channel:${msg.content.channel_id}`).emit(msg.ev_type, msg.content);
};

const scopeToHandlerMapping: { [scope: number]: any } = {
  0: handleUserScope,
  1: handleGuildScope,
  2: handleChannelScope,
};

export const handleDispatchedMessage = (
  io: Server,
  msg: TDispatchedMessage
) => {
  scopeToHandlerMapping[msg.scope](io, msg);
};
