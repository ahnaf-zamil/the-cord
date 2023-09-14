import { Server } from "socket.io";
import jwtConfig from "../config/jwt.config";
import jwt from "jsonwebtoken";
import { getDatabaseClient } from "../lib/db";
import db_tables from "../lib/db_tables";

const authenticateClient = (token: string): string | null => {
  /* Authenticates client by checking JWT and returns user ID */
  try {
    const tokenData = jwt.verify(token, jwtConfig.JWT_SECRET);
    return (tokenData as any).user_id;
  } catch (err) {
    if (!(err instanceof jwt.JsonWebTokenError)) {
      console.log(err);
    }
    return null;
  }
};

export default (io: Server, callback: Function) => {
  io.on("connection", async (socket) => {
    /* 
    Upon connection, the following steps will take place:
    1. Client will be authenticated
    2. Client's guild IDs will be fetched and it will be added to the rooms

    All of these are todo as of now
    */

    const dbClient = await getDatabaseClient();

    console.log("Socket has connected: " + socket.id);

    // Authenticating client
    const user_id = authenticateClient(socket.handshake.auth.token);
    if (!user_id) {
      socket.send({ error: "Unauthorized" });
      return socket.disconnect();
    }

    // Sending client it's guilds and adding them to rooms
    const res = await dbClient.query(
      `SELECT g.*, json_agg(json_build_object('id', c.id, 'name', c.name, 'type', c.type)) as channels 
      FROM ${db_tables.GUILDS} g 
      JOIN ${db_tables.CHANNELS} c ON c.guild_id=g.id 
      JOIN ${db_tables.GUILD_USER_JOIN} gj ON g.id = gj.guild_id 
      WHERE gj.user_id=$1 GROUP BY g.id`,
      [user_id]
    );
    res.rows.forEach((guild) => {
      socket.join(guild.id);
      socket.emit("GUILD_CREATE", guild);
    });

    socket.emit("CLIENT_READY");
  });

  io.on("disconnect", (socket) => {
    console.log("Socket has disconnected: " + socket.id);
  });

  callback();
};
