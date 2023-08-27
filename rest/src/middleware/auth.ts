import { RequestHandler } from "express";
import db from "../lib/db";

export const authRequired: RequestHandler = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await db.repos.user.findOne({
    where: { id: req.session.userId },
  });
  if (user == null) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    req.user = user;
    return next();
  }
};
