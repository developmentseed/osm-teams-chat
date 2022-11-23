const Pusher = require("pusher")


export default function handler(req, res) {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  })

  // FIXME: add some validation for POST params
  const {
    username,
    channel,
    msg
  } = req.body

  if (!req.headers.authorization) {
    res.status(401).json({'error': 'Not authorized'})
  }
  
  const accessToken = req.headers.authorization.replace('Bearer ', '');
  //FIXME: Implement check if accessToken has permission to POST to this channel

  // FIXME: Add some error handling
  pusher.trigger(channel, 'chat', {
    username,
    msg
  })
  res.status(200).json({ok: 'ok'})
}