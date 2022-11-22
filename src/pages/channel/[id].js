import { useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Text, Textarea, Button, Flex, Heading } from "@chakra-ui/react";
import pusherJs from "pusher-js";


const dummyMessages = [
  { from: "marc", text: "Hello", timestamp: 1669042245033 },
  { from: "vitor", text: "Hi", timestamp: 1669042245133 },
  { from: "marc", text: "How are you?", timestamp: 1669042245233 },
  { from: "vitor", text: "I'm doing great, thanks", timestamp: 1669042245333 },
];

export default function ChannelView() {
  const { query } = useRouter();
  const [messages, setMessages] = useState(dummyMessages);
  const [msgValue, setMsgValue] = useState('');
  const channelId = query.id;
  let handleMsgChange = (e) => {
    setMsgValue(e.target.value);
  };

  let sendMessage = function() {
    const msg = msgValue;
    const username = "test-user"; //FIXME: get username correctly
    const channel = `${channelId}`;
    fetch('/api/chat/post', {
      'method': 'POST',
      'headers': { 'Content-Type': 'application/json' },
      'body': JSON.stringify({msg, username, channel})
    })
    setMsgValue('')
  };



  useEffect(() => {
    const pusher = new pusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
      // FIXME: ADD channelAuthorization
    });
    pusher.subscribe('1'); //FIXME: use correct channel name
    pusher.bind('chat', function(data) {
      const message = {
        from: data.username,
        text: data.msg,
        timestamp: new Date().toString()
      }
      console.log('received msg', message);
      const newMessages = messages.concat([message]);
      setMessages(newMessages);
    });
  }, []);

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" w={400} p={12} rounded={6}>
        <Heading mb={6}>OSM Teams Chat</Heading>
        {messages.map((m) => (
          <Text key={m.timestamp}>
            {m.from}: {m.text}{" "}
          </Text>
        ))}
        <Textarea
          value={msgValue}
          onChange={handleMsgChange}
          placeholder={'Type your message here...'}
          size="m"
        />
        <Button
          onClick={sendMessage}
        >
          Send
        </Button>
        <NextLink href={`/`} passHref>
          <Button colorScheme="teal" mt={5}>
            Back to home page
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
}
