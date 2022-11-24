import { assoc } from "ramda";
import { getToken } from "next-auth/jwt";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function cachedUserTeams(userId, accessToken) {
  let teams = await redis.get(`user:${userId}:teams`);
  if (!teams || teams.length === 0) {
    teams = await getMyTeams(accessToken);
    await redis.set(`user:${userId}:teams`, teams, { ex: 300 }); // set expiry to 5 mins
    return teams;
  } else {
    return teams;
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
    .then((data) => {
      if (data) {
        const memberOf = data.member;
        const moderatorOf = data.moderator;

        const teams = memberOf.map((team) => {
          for (let moderatedTeam of moderatorOf) {
            if (moderatedTeam.id === team.id) {
              return assoc("moderator", true, team);
            }
          }
          return team;
        });
        return teams;
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
