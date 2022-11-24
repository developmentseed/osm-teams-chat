import { useState, useEffect, useReducer } from "react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import MapInput from "../../components/MapInput";
import Message from "../../components/Message";
import { assoc } from "ramda";

import {
  Text,
  Button,
  Flex,
  Heading,
  Stack,
  Spinner,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import pusherJs from "pusher-js";
import TextInput from "../../components/TextInput";

const ADD_MESSAGE_ACTION = "ADD_MESSAGE_ACTION";
const ADD_MESSAGE_HISTORY = "ADD_MESSAGE_HISTORY";

export async function getServerSideProps(context) {
  return {
    props: { channelId: context.query.id },
  };
}

export default function ChannelView(props) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  let [messages, dispatchMessages] = useReducer((state, action) => {
    console.log(state, action);
    if (action.type === ADD_MESSAGE_ACTION) {
      return [...state, action.data];
    }
    if (action.type === ADD_MESSAGE_HISTORY) {
      return action.data;
    }
    throw Error("Unknown action.");
  }, []);

  const username = session?.user?.name || "anonymous";
  const channelId = `presence-${props.channelId}`;

  const sendMessage = function (type) {
    return function (msg) {
      const channel = `${channelId}`;

      //FIXME: If the server returns a 401 here, we need to display an error to the user.
      fetch("/api/chat/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ msg, username, channel, type }),
      });
    };
  };

  useEffect(() => {
    // Wait for authentication
    if (status !== "authenticated") return;
    if (!channelId) return;

    const pusher = new pusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: "/api/chat/auth",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    });
    fetch(`/api/chat/${channelId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(({ messageHistory, mapHistory }) => {
        // set type
        let allHistory = [];
        messageHistory.forEach((message) => {
          allHistory.push(assoc("type", "text", message));
        });
        mapHistory.forEach((message) => {
          allHistory.push(assoc("type", "map", message));
        });

        setLoading(false);
        dispatchMessages({
          type: ADD_MESSAGE_HISTORY,
          data: allHistory,
        });
      });
    pusher.subscribe(`${channelId}`);
    pusher.bind("chat", function (data) {
      const message = {
        type: data.type,
        from: data.username,
        text: data.msg,
        timestamp: Date.now(),
      };
      dispatchMessages({
        type: ADD_MESSAGE_ACTION,
        data: message,
      });
    });

    return () => {
      pusher.disconnect();
    };
  }, [status, channelId, session]);

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" w={900} p={12} rounded={6}>
        <Heading mb={6}>OSM Teams Chat</Heading>
        <Stack height="50vh" overflow={"scroll"}>
          {messages.length > 0 ? (
            messages
              .sort((a, b) => a.timestamp > b.timestamp)
              .map((data, index) => {
                return (
                  <Message
                    key={index}
                    messageData={data}
                    isMyMessage={data.from === username}
                  />
                );
              })
          ) : loading ? (
            <Spinner />
          ) : (
            <Text>No messages yet.</Text>
          )}
        </Stack>
        <Tabs size="md" variant="enclosed">
          <TabList>
            <Tab>Text</Tab>
            <Tab>Map</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TextInput loading={loading} sendMessage={sendMessage("text")} />
            </TabPanel>
            <TabPanel>
              <MapInput loading={loading} sendMessage={sendMessage("map")} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <NextLink href={`/`} passHref>
          <Button colorScheme="teal" mt={5}>
            Back to home page
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
}
