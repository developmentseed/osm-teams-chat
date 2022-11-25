import { useState, useEffect, useReducer, useRef } from "react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import MapInput from "../../components/MapInput";
import Message from "../../components/Message";
import { assoc } from "ramda";
import AllPointsMap from "../../components/AllPointsMap";

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
const ADD_MAP_POINT = "ADD_MAP_POINT";
const ADD_MAP_HISTORY = "ADD_MAP_HISTORY";

export async function getServerSideProps(context) {
  return {
    props: { channelId: context.query.id },
  };
}

function ChatHistory({ messages, username }) {
  const chatHistoryBottom = useRef();

  // Scroll to bottom of chat history
  useEffect(() => {
    chatHistoryBottom.current.scrollIntoView();
  }, [messages.length]);

  return (
    <>
      {messages
        .sort((a, b) => a.timestamp > b.timestamp)
        .map((data, index) => {
          return (
            <Message
              key={index}
              messageData={data}
              isMyMessage={data.from === username}
            />
          );
        })}
      <div ref={chatHistoryBottom}></div>
    </>
  );
}

export default function ChannelView(props) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [channelName, setChannelName] = useState("OSM Teams Chat");

  const [mapData, dispatchMapdata] = useReducer((state, action) => {
    if (action.type === ADD_MAP_POINT) {
      return [...state, action.data];
    }
    if (action.type === ADD_MAP_HISTORY) {
      return action.data;
    }
    throw Error("Unknown action.");
  }, []);

  let [messages, dispatchMessages] = useReducer((state, action) => {
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
          Authorization: `Bearer ${session?.accessToken}`,
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
      .then(({ messageHistory, mapHistory, channelName }) => {
        // set type
        let allHistory = [];
        messageHistory.forEach((message) => {
          allHistory.push(assoc("type", "text", message));
        });
        mapHistory.forEach((message) => {
          allHistory.push(assoc("type", "map", message));
        });

        setChannelName(channelName);

        setLoading(false);
        dispatchMessages({
          type: ADD_MESSAGE_HISTORY,
          data: allHistory,
        });
        dispatchMapdata({
          type: ADD_MAP_HISTORY,
          data: mapHistory,
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
      if (data.type === "map") {
        dispatchMapdata({
          type: ADD_MAP_POINT,
          data: message,
        });
      }
    });

    return () => {
      pusher.disconnect();
    };
  }, [status, channelId, session]);

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" w={900} p={12} rounded={6}>
        <Heading mb={6}>{channelName}</Heading>
        <Stack height="50vh" overflow={"scroll"}>
          {messages.length > 0 ? (
            <ChatHistory messages={messages} username={username}></ChatHistory>
          ) : loading ? (
            <Spinner />
          ) : (
            <Text>No messages yet.</Text>
          )}
        </Stack>
        <Tabs size="md" colorScheme={"teal"}>
          <TabList>
            <Tab>📝 Write</Tab>
            <Tab>📍Add a location</Tab>
            <Tab>🗺️ View Map</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TextInput loading={loading} sendMessage={sendMessage("text")} />
            </TabPanel>
            <TabPanel>
              <MapInput loading={loading} sendMessage={sendMessage("map")} />
            </TabPanel>
            <TabPanel>
              <AllPointsMap data={mapData} />
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
