import express from "express";
import { Joi, validate } from "express-validation";
import { authRequired } from "../middleware/auth";
import db from "../lib/db";
import snowflake from "../lib/snowflake";
import { GuildModel } from "../models/guild.model";
import { ChannelTypes } from "../types/channelTypes";
import { ChannelModel } from "../models/channel.model";
import { GuildMemberModel } from "../models/guild_member.model";
import { isGuildMember, isGuildOwner } from "../middleware/perms";

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
      owner_id: req.user?.id,
    });
    await db.repos.guild.save(guild);

    // Adding owner as first member
    const newMember: GuildMemberModel = db.repos.guildMember.create({
      guild_id: guild.id,
      user_id: req.user?.id,
    });
    await db.repos.guildMember.save(newMember);

    // Creating first channel
    const generalChannel = db.repos.channel.create({
      id: snowflake.generate(),
      name: "general",
      type: ChannelTypes.TEXT,
      guild_id: guild.id,
    });
    await db.repos.channel.save(generalChannel);

    res.status(201).json(guild.toJSON());
  }
);

// Fetch channels for guild
router.get(
  "/:guild_id/channels",
  authRequired,
  isGuildMember,
  async (req, res) => {
    const guild_id = req.params.guild_id;
    const channels: Array<ChannelModel> = await db.repos.channel.find({
      where: { guild_id: guild_id },
    });
    res.status(200).json(channels.map((c) => c.toJSON()));
  }
);

const CreateChannelValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }),
};

// Create guild channel
router.post(
  "/:guild_id/channels/create",
  authRequired,
  isGuildOwner,
  validate(CreateChannelValidation),
  async (req, res) => {
    const name: string = req.body.name.toLowerCase();
    const channel: ChannelModel = db.repos.channel.create({
      id: snowflake.generate(),
      name,
      type: ChannelTypes.TEXT,
      guild_id: req.params.guild_id,
    });
    await db.repos.channel.save(channel);

    res.status(201).json(channel.toJSON());
  }
);

export default router;
