import { RequestHandler } from "express";
import db from "../lib/db";
import { GuildModel } from "../models/guild.model";

// Middleware to check if the requesing user is the guild's owner

// NOTE: It requires the route parameter 'guild_id'
export const isGuildOwner: RequestHandler = async (req, res, next) => {
  console.log(req.user);
  console.log(req.params);
  const guild: GuildModel = await db.repos.guild.findOne({
    // Make sure the route parameter for guild ID for all routes using this middleware is named 'guild_id'
    where: { id: req.params.guild_id },
  });
  if (guild.ownerId != req.user?.id) {
    return res.status(403).json({ error: "Missing permissions" });
  }
  return next();
};
