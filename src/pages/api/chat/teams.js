import { getToken } from "next-auth/jwt";
import { Redis } from "@upstash/redis";
import { isEmpty } from "ramda";

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
      await fetch(`https://mapping.team/api/my/teams?${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((respJSON) => {
          const { data, pagination } = respJSON;
          if (!data) return [];
          else {
            currentPagination = pagination;
            page++;
            data.forEach((team) => {
              teams.push(team);
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
    // keep running until there's no next page
  } while (
    !isEmpty(currentPagination) &&
    currentPagination.currentPage < currentPagination.lastPage
  );
  return teams;
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
