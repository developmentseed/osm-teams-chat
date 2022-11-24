const Pusher = require("pusher");
import { getToken } from "next-auth/jwt";
import { cachedUserTeams } from "./teams";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  // FIXME: add some validation for POST params
  const token = await getToken({ req });

  if (!token) {
    // Not Signed in
    res.status(401).json({ error: "Not authorized" });
  }

  const { userId, accessToken } = token;

  const { username, channel, msg } = req.body;

  try {
    const myTeams = await cachedUserTeams(userId, accessToken);

    const channelId = channel.replace("presence-", "");

    const teamIds = myTeams.map((t) => t.id.toString());
    if (!teamIds.includes(channelId)) {
      return res.status(401).json({ error: "Not authorized" });
    }

    await pusher.trigger(channel, "chat", {
      username,
      msg,
    });

    const listLength = await redis.lpush(channel, {
      from: username,
      text: msg,
      timestamp: Date.now(),
    });
    // Keep at most 50 messages per channel
    if (listLength > 50) {
      await redis.rpop(channel);
    }

    return res.status(200).json({ ok: "ok" });
  } catch (e) {
    console.log("auth error", e);
    return res.status(401).json({ error: "Not authorized" });
  }
}
