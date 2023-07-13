import Redis from "ioredis";

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

    Uses Redis to dispatch events from REST interaction to gateway so users
    will be updated live. 
    */
  redis: Redis;

  constructor(host: string = "localhost", port: number = 6379) {
    this.redis = new Redis({ host, port });
  }

  dispatch(content: object, scope: DispatchScopes, ev_type: EventTypes) {
    /*
        3 scopes of gateway dispatching

        'user': This is to dispatch something to only a specific user
        'guild': This is to dispatch something to all members of a specific guild
        'channel': This is to dispatch something to all members of a specific channel 
    */
    this.redis.publish(
      "_",
      JSON.stringify({
        content,
        scope,
        ev_type: EventTypes[ev_type],
      })
    );
  }
}

export const dispatcher = new GatewayDispatcher();
