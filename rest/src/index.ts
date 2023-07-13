import express from "express";
import cors from "cors";
import { DispatchScopes, EventTypes, dispatcher } from "./lib/gateway";
import db from "./lib/db";
import { ValidationError } from "express-validation";

const PORT = process.env.port || 5000;

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

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
      db.sequelize.sync({ force: true }).then(() => {
        console.log("Synchronised with database");
      });
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Couldn't connect to database");
  });
