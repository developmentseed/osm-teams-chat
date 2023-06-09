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
  let currentPagination = {};
  let teams = [];
  let page = 0;
  do {
    // try catch to catch any errors in the async api call
    try {
      // use node-fetch to make api call
      const resp = await fetch("https://mapping.team/api/my/teams");
      const respJSON = await resp.json();
      const { data, pagination } = respJSON;
      currentPagination = pagination;
      data.forEach((team) => {
        teams.push(team);
      });
      // increment the page with 1 on each loop
      page++;
    } catch (err) {
      console.error(err);
    }
    // keep running until there's no next page
  } while (currentPagination.currentPage < currentPagination.lastPage);
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
