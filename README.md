# OSM Teams Chat

A chat platform for OSM Teams.

## Development

Install requirements:

- [nvm](https://github.com/creationix/nvm)

Install Node.js the required version (see [.nvmrc](.nvmrc) file):

    nvm i

Install Node.js modules:

    yarn

Go to <https://mapping.team> and register a new app with callback URL `http://localhost:3000/api/auth/callback/osm-teams`.

Go to <https://pusher.com> register a new app for a React/Node.js tech stack.  

Go to <https://upstash.com> register a new app for Redis.

Add OSM Teams, Pusher, and Upstash Redis configurations to environment variables in .env.local, following this example:

```
OSM_TEAMS_CLIENT_ID=<client_id>
OSM_TEAMS_CLIENT_SECRET=<client_secret>
PUSHER_APP_ID="pusher_app_id"
PUSHER_KEY="pusher_key"
PUSHER_SECRET="pusher_secret"
PUSHER_CLUSTER="pusher_cluster"
NEXT_PUBLIC_PUSHER_KEY="pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="pusher_cluster"
UPSTASH_REDIS_REST_URL="upstash_redis_rest_url"
UPSTASH_REDIS_REST_TOKEN="upstash_redis_rest_token"
```

Start the server:

    yarn dev

✨ You can now login to the app at <http://localhost:3000>

## LICENSE

[MIT](LICENSE)
