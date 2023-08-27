import express from "express";
import { Joi, validate } from "express-validation";
import { authRequired } from "../middleware/auth";
import db from "../lib/db";
import snowflake from "../lib/snowflake";
import { GuildModel } from "../models/guild.model";
import { ChannelTypes } from "../types/channelTypes";

const router = express.Router();

const CreateGuildValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }),
};

// Create guild
router.post(
  "/create",
  authRequired,
  validate(CreateGuildValidation),
  async (req, res) => {
    const name: string = req.body.name;

    // Creating guild
    const guild: GuildModel = db.repos.guild.create({
      id: snowflake.generate(),
      name,
      ownerId: req.user?.id,
    });
    await db.repos.guild.save(guild);

    // Creating first channel
    const generalChannel = db.repos.channel.create({
      id: snowflake.generate(),
      name: "general",
      type: ChannelTypes.TEXT,
      guildId: guild.id,
    });
    await db.repos.channel.save(generalChannel);

    // WIP: Adding "owner" to guild

    res.json(201);
  }
);

export default router;
