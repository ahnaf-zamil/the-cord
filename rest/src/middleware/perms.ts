import { RequestHandler } from "express";
import db from "../lib/db";
import { GuildModel } from "../models/guild.model";
import { GuildMemberModel } from "../models/guild_member.model";
import { ChannelModel } from "../models/channel.model";

// Middleware to check if the requesing user is the guild's owner
// **NOTE**: It requires the route parameter 'guild_id'
export const isGuildOwner: RequestHandler = async (req, res, next) => {
  const guild: GuildModel = await db.repos.guild.findOne({
    // Make sure the route parameter for guild ID for all routes using this middleware is named 'guild_id'
    where: { id: req.params.guild_id },
  });
  if (guild.ownerId != req.user?.id) {
    return res
      .status(403)
      .json({ error: "Missing permissions: You are not owner of this guild" });
  }
  return next();
};

// Middleware to check if the requesing user is the guild's owner
// **NOTE**: It requires the route parameter 'guild_id' OR 'channel_id'
export const isGuildMember: RequestHandler = async (req, res, next) => {
  // Setting this as a local var since I don't want to rewrite logic
  let guildId: string | number;

  if ("guild_id" in req.params) {
    // Use guild ID to check perms
    guildId = req.params.guild_id;
  } else if ("channel_id" in req.params) {
    // If a channel ID is given, use that to query channel and fetch guild ID, then check for membership
    const channel: ChannelModel = await db.repos.channel.findOne({
      where: { id: req.params.channel_id },
    });
    // If channel doesn't exist, throw 404 not found
    if (channel == null) {
      return res.status(404).json({ error: "Channel not found" });
    }
    guildId = channel.guildId;
  } else {
    throw Error("No route params called `guild_id` or `channel_id`");
  }

  const guildMember: GuildMemberModel = await db.repos.guildMember.findOne({
    where: { guildId: guildId, userId: req.user?.id },
  });

  // If guild member does not exist i.e user isn't a member of the guild, throw 403 forbidden
  if (guildMember == null) {
    return res.status(403).json({
      error: "Missing permissions: You aren't a member of this guild",
    });
  }

  return next();
};
