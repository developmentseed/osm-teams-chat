import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { Text, Textarea, Button, Flex, Heading } from "@chakra-ui/react"
import pusherJs from "pusher-js"

export default function ChannelView() {
  const { data: session, status } = useSession()
  const { query } = useRouter()
  let [messages, setMessages] = useState([])
  const [msgValue, setMsgValue] = useState('')
  
  const userName = session?.user?.name || 'anonymous';
  const channelId = `presence-${query.id}`
  let handleMsgChange = (e) => {
    setMsgValue(e.target.value)
  }

  let sendMessage = function() {
    const msg = msgValue
    const username = userName
    const channel = `${channelId}`

    //FIXME: If the server returns a 401 here, we need to display an error to the user.
    fetch('/api/chat/post', {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      'body': JSON.stringify({msg, username, channel})
    })
    setMsgValue('')
  };



  useEffect(() => {
    // Wait for authentication    
    if (status !== 'authenticated') return;

    const pusher = new pusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: '/api/chat/auth',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      }
    })
    pusher.subscribe(`${channelId}`)
    pusher.bind('chat', function(data) {
      const message = {
        from: data.username,
        text: data.msg,
        timestamp: new Date().toString()
      }
      setMessages([...messages, message]);
    })
  }, [status])

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" w={400} p={12} rounded={6}>
        <Heading mb={6}>OSM Teams Chat</Heading>
        {messages.length > 0 ? (
          messages.map((m) => (
            <Text key={m.timestamp}>
              {m.from}: {m.text}{" "}
            </Text>
          ))
        ) : (
          <Text>No messages yet.</Text>
        )}
        <Textarea
          value={msgValue}
          onChange={handleMsgChange}
          placeholder={"Type your message here..."}
          size="m"
        />
        <Button onClick={sendMessage}>Send</Button>
        <NextLink href={`/`} passHref>
          <Button colorScheme="teal" mt={5}>
            Back to home page
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
}
