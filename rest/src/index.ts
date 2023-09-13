import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import db from "./lib/db";
import session from "express-session";
import Redis from "ioredis";
import { ValidationError } from "express-validation";
import RedisStore from "connect-redis";
import redisConf from "./config/redis.config";
import path from "path";

const PORT = process.env.port || 5000;
const isDev =
  (process.env.NODE_ENV || "development") == "development" ? true : false;

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke L!");
});

declare module "express-session" {
  interface SessionData {
    user_id: string;
  }
}

const redisStore = new RedisStore({
  client: new Redis(parseInt(redisConf.PORT.toString()), redisConf.HOST),
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
      httpOnly: true,
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
app.use("/gateway", require("./routes/gateway.route").default);

// Output test.html file in dev environments
if (isDev) {
  app.use(express.static(path.join(__dirname, "public")));
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/test.html"));
  });
}

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
