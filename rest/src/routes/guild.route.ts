import express from "express";
import { Joi, validate } from "express-validation";
import { authRequired } from "../middleware/auth";
import db from "../lib/db";
import snowflake from "../lib/snowflake";
import { GuildModel } from "../models/guild.model";
import { ChannelTypes } from "../types/channelTypes";
import { ChannelModel } from "../models/channel.model";

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
    guild.members = [req.user!];
    await db.repos.guild.save(guild);

    // Creating first channel
    const generalChannel = db.repos.channel.create({
      id: snowflake.generate(),
      name: "general",
      type: ChannelTypes.TEXT,
      guild: guild,
    });
    await db.repos.channel.save(generalChannel);

    res.status(201).json(guild.toJSON());
  }
);

// Fetch channels for guild
router.get("/:guild_id/channels", async (req, res) => {
  const guildId = req.params.guild_id;
  const channels: Array<ChannelModel> = await db.repos.channel.find({
    where: { guildId },
  });
  res.status(200).json(channels.map((c) => c.toJSON()));
});

export default router;
