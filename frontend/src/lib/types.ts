export interface IGatewayChannel {
  id: string;
  name: string;
  type: number;
}

export interface IGatewayGuild {
  id: string;
  name: string;
  owner_id: string;
  channels: Array<IGatewayChannel>;
}

export interface IAuthedUser {
  id: string;
  handle: string;
  username: string;
  email: string;
}
