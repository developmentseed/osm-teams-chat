const { authOptions } = require('../auth/[...nextauth]')
import getMyTeams from "../../../getMyTeams"
const Pusher = require("pusher")

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
})
export default async function handler(req, res) {
  const socketId = req.body.socket_id
  const channel = req.body.channel_name
  const accessToken = req.headers.authorization.replace('Bearer ', '')

  try {
    const myTeams = await getMyTeams(accessToken);
    const channelId = channel.replace('presence-', '')
    const teamIds = myTeams.map(t => t.id.toString());
    if (!teamIds.includes(channelId)) {
      return res.status(401).json({'error': 'Not authorized'})
    }
  } catch (e) {
    console.log('auth error', e);
    return res.status(401).json({'error': 'Not authorized'})
  }

  const presenceData = {
    user_id: 14, //FIXME get actual user ID
    user_info: {
      username: 'marc' //FIXME get actual user name
    }
  }
  //FIXME: use the `accessToken` to validate the user permission by calling mapping.team
  // and only then return the `authResponse` as below, else return a 401.
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData)
  res.send(authResponse)
}
