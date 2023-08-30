import express from "express";
import { validate, Joi } from "express-validation";
import { authRequired } from "../middleware/auth";
import { isGuildMember } from "../middleware/perms";
import { DispatchScopes, EventTypes, gatewayDispatcher } from "../lib/gateway";

const router = express.Router();

const SendMessageValidation = {
  body: Joi.object({
    content: Joi.string().min(1).max(2000).required(),
  }),
};

// Send message
router.post(
  "/:channel_id/send",
  validate(SendMessageValidation),
  authRequired,
  isGuildMember,
  async (req, res) => {
    const content = req.body.content;
    // Todo: Implement message send

    // Dispatching the new message event to gateway servers
    gatewayDispatcher.dispatch(
      { channel_id: req.params.channel_id, content },
      DispatchScopes.CHANNEL,
      EventTypes.MESSAGE_CREATE
    );
    res.json(201);
  }
);

export default router;
