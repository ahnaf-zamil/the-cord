import express from "express";
import cors from "cors";
import { DispatchScopes, EventTypes, dispatcher } from "./lib/gateway";
import db from "./lib/db";
import session from "express-session";
import Redis from "ioredis";
import { ValidationError } from "express-validation";
import RedisStore from "connect-redis";

const PORT = process.env.port || 5000;

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const redisStore = new RedisStore({
  client: new Redis(),
  prefix: "REST_SESSION:",
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: "testing",
    cookie: {
      maxAge: 604800000, // 7 days in ms
    },
  })
);

app.post("/send_message", (req, res) => {
  const channelId = req.body.channel_id;
  const content = req.body.content;

  dispatcher.dispatch(
    { channel_id: channelId, content },
    DispatchScopes.CHANNEL,
    EventTypes.MESSAGE_CREATE
  );
  res.status(201);
  res.send("");
});

app.use(function (err: Error, req: any, res: any, next: any) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

// Loading routes
app.use("/guilds", require("./routes/guild.route").default);
app.use("/users", require("./routes/user.route").default);

db.sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      db.sequelize.sync({ alter: true }).then(() => {
        console.log("Synchronised with database");
      });
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Couldn't connect to database");
  });
