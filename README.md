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

Add the provided client id and secret to .env.local:

```
OSM_TEAMS_CLIENT_ID=<client_id>
OSM_TEAMS_CLIENT_SECRET=<client_secret>
```

Start the server:

    yarn dev

✨ You can now login to the app at <http://localhost:3000>

## LICENSE

[MIT](LICENSE)
