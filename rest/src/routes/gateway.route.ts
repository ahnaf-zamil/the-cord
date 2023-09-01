import express from "express";
import jwt from "jsonwebtoken";
import { authRequired } from "../middleware/auth";
import jwtConfig from "../config/jwt.config";

const router = express.Router();

// Get gateway authentication token
// This token will be used by client to authenticate with gateway
router.post("/auth", authRequired, async (req, res) => {
  const token = jwt.sign(
    { user_id: req.user?.id.toString() },
    jwtConfig.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: jwtConfig.JWT_EXPIRY_SECONDS,
    }
  );
  res.status(200).json({ token });
});

export default router;
