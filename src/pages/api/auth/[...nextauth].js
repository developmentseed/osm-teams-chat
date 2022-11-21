import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: "osm-teams",
      name: "OSM Teams",
      type: "oauth",
      wellKnown: "https://mapping.team/hyauth/.well-known/openid-configuration" ,
      authorization: { params: { scope: "openid offline" } },
      idToken: true,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.preferred_username,
          image: profile.picture
        }
      },
      clientId: process.env.OSM_TEAMS_CLIENT_ID,
      clientSecret: process.env.OSM_TEAMS_CLIENT_SECRET
    }
  ],

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
})