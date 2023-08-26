import natsConfig from "../config/nats.config";
import { connect, StringCodec, NatsConnection } from "nats";

let natsClient: NatsConnection | null;

export const getNATSClient = async () => {
  if (!natsClient) {
    natsClient = await connect({ servers: natsConfig.SERVERS });
    console.log("Connected to NATS");
  }
  return natsClient;
};
