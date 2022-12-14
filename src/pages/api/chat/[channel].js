import { getToken } from "next-auth/jwt";
import { cachedUserTeams } from "./teams";
import { Redis } from "@upstash/redis";
import { find, propEq } from "ramda";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // FIXME: add some validation for POST params
  const token = await getToken({ req });
  const channel = req.query.channel;

  if (!token) {
    // Not Signed in
    res.status(401).json({ error: "Not authorized" });
  }

  const { userId, accessToken } = token;

  try {
    const myTeams = await cachedUserTeams(userId, accessToken);

    const channelId = channel.replace("presence-", "");

    const teamIds = myTeams.map((t) => t.id.toString());
    if (!teamIds.includes(channelId)) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Get channel name
    const channelName = find(propEq("id", parseInt(channelId)), myTeams)?.name;

    // Get history from redis
    const messageHistory = await redis.lrange(channel, 0, 50);
    const mapHistory = await redis.lrange(`${channel}:map`, 0, -1);

    return res.status(200).json({ messageHistory, mapHistory, channelName });
  } catch (e) {
    console.log("auth error", e);
    return res.status(401).json({ error: "Not authorized" });
  }
}
