import express from "express";
import bcrypt from "bcrypt";
import { validate, ValidationError, Joi } from "express-validation";
import db from "../lib/db";
import snowflake from "../lib/snowflake";

const router = express.Router();

const RegisterValidation = {
  body: Joi.object({
    handle: Joi.string().min(3).max(30).required(),
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

// Register account
router.post("/register", validate(RegisterValidation), async (req, res) => {
  const handle: string = req.body.handle;
  const username: string = req.body.username.toLowerCase();
  const email: string = req.body.email.toLowerCase();
  const password: string = req.body.password;

  // Checking for existing account
  if ((await db.user.findOne({ where: { email } })) !== null) {
    return res.status(409).json({ error: "User exists" });
  }

  const hashedPw = await bcrypt.hash(password, 10);
  console.log(hashedPw);
  await db.user.create({
    id: snowflake.generate(),
    handle,
    username,
    email,
    password: hashedPw,
  });

  res.json(201);
});

const LoginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Log into account
router.post("/login", validate(LoginValidation), async (req, res) => {
  const email: string = req.body.email.toLowerCase();
  const password: string = req.body.password;

  // Checking for existing account
  const existingUser = await db.user.findOne({ where: { email } });
  if (existingUser == null) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Check pw hash
  if ((await bcrypt.compare(password, existingUser.password)) == false) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Setting session
  req.session.userId = existingUser.id;
  res.json(201);
});

export default router;