const Pusher = require("pusher");



export default function handler(req, res) {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });

  // FIXME: add some validation for POST params
  const {
    username,
    channel,
    msg
  } = req.body
  // FIXME: Add some error handling
  pusher.trigger(channel, 'chat', {
    username,
    msg
  })
  res.status(200).json({ok: 'ok'})
}