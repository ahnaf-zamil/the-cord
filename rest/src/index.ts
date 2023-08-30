import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import db from "./lib/db";
import session from "express-session";
import Redis from "ioredis";
import { ValidationError } from "express-validation";
import RedisStore from "connect-redis";
import redisConf from "./config/redis.config";

const PORT = process.env.port || 5000;

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke L!");
});

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const redisStore = new RedisStore({
  client: new Redis(redisConf.PORT, redisConf.HOST),
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

app.use(function (err: Error, req: any, res: any, next: any) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

// Loading routes
app.use("/guilds", require("./routes/guild.route").default);
app.use("/users", require("./routes/user.route").default);
app.use("/channels", require("./routes/channel.route").default);

db.dataSource
  .initialize()
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, async () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Couldn't connect to database");
  });
