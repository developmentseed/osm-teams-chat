import { Stack, Text, Flex } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { MapText } from "./MapText";
import MessageText from "./MessageText";

function MessageBody({ messageData }) {
  return (
    <Stack>
      {messageData.type === "map" ? (
        <MapText feature={messageData.text}></MapText>
      ) : (
        <MessageText>{messageData.text}</MessageText>
      )}
      <Text fontSize={"xs"} fontWeight={"light"}>
        {DateTime.fromMillis(messageData.timestamp).toRelative()}
      </Text>
    </Stack>
  );
}

export default function Message({ messageData, isMyMessage }) {
  if (isMyMessage) {
    return (
      <Flex w="100%" justify="flex-end" rounded={6}>
        <Flex
          bg="teal.500"
          color="white"
          minW="100px"
          maxW="350px"
          rounded={6}
          my="1"
          p="3"
        >
          <MessageBody messageData={messageData} />
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex w="100%">
        <Stack spacing={0}>
          <Text fontSize="xs">{messageData.from}</Text>
          <Flex
            bg="gray.200"
            rounded={6}
            color="black"
            minW="100px"
            maxW="350px"
            my="1"
            p="3"
          >
            <MessageBody messageData={messageData} />
          </Flex>
        </Stack>
      </Flex>
    );
  }
}
