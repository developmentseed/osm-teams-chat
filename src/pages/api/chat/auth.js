import { getToken } from "next-auth/jwt";
const Pusher = require("pusher");

import { cachedUserTeams } from "./teams";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  const token = await getToken({ req });
  let userId;
  let presenceData = {};

  if (token) {
    // Signed in
    userId = token.userId;

    presenceData = {
      user_id: userId,
      user_info: {
        username: token.name,
        image: token.picture,
      },
    };
  } else {
    // Not Signed in
    res.status(401).json({ error: "not signed in" });
  }

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const accessToken = req.headers.authorization.replace("Bearer ", "");

  try {
    const myTeams = await cachedUserTeams(userId, accessToken);
    const channelId = channel.replace("presence-", "");
    const teamIds = myTeams.map((t) => t.id.toString());
    if (!teamIds.includes(channelId)) {
      return res.status(401).json({ error: "Not authorized" });
    }
  } catch (e) {
    console.log("auth error", e);
    return res.status(401).json({ error: "Not authorized" });
  }

  //FIXME: use the `accessToken` to validate the user permission by calling mapping.team
  // and only then return the `authResponse` as below, else return a 401.
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  res.send(authResponse);
}
