import { getToken } from "next-auth/jwt";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function cachedUserTeams(userId, accessToken) {
  let teams = await redis.json.get(`user:${userId}:teams`, "$");
  if (!teams || teams.length === 0) {
    teams = await getMyTeams(accessToken);
    await redis.json.set(`user:${userId}:teams`, "$", teams, {
      nx: true,
    }); // set expiry to 5 mins
    await redis.expire(`user:${userId}:teams`, 300);
    return teams[0];
  } else {
    return teams[0];
  }
}

export async function getMyTeams(accessToken) {
  if (!accessToken) return [];
  return fetch("https://mapping.team/api/my/teams", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((responseJSON) => {
      const { data } = responseJSON;
      if (data) {
        return data;
      } else {
        return [];
      }
    });
}

export default async function handler(req, res) {
  const token = await getToken({ req });

  if (!token) {
    // Not Signed in
    res.status(401).json({ error: "Not authorized" });
  }

  const { userId, accessToken } = token;
  const myTeams = await cachedUserTeams(userId, accessToken);

  return res.status(200).send(myTeams);
}
