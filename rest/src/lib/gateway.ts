import { NatsConnection } from "nats";
import { getNATSClient } from "./nats";

export enum DispatchScopes {
  USER = 0,
  GUILD,
  CHANNEL,
}

export enum EventTypes {
  MESSAGE_CREATE,
}

class GatewayDispatcher {
  /* Class for handling all gateway dispatching shenanigans.

    Uses NATS to dispatch events from REST interaction to gateway so users
    will be updated live. 
    */
  nats: NatsConnection | null;

  constructor() {
    // Initializing connection when server starts
    getNATSClient().then((nc) => {
      this.nats = nc;
    });
  }

  async dispatch(data: object, scope: DispatchScopes, ev_type: EventTypes) {
    /*
        3 scopes of gateway dispatching

        'user': This is to dispatch something to only a specific user
        'guild': This is to dispatch something to all members of a specific guild
        'channel': This is to dispatch something to all members of a specific channel 
    */
    this.nats = await getNATSClient();
    this.nats.publish(
      "_",
      JSON.stringify({
        data,
        scope,
        ev_type: EventTypes[ev_type],
      })
    );
  }
}

export const gatewayDispatcher = new GatewayDispatcher();
