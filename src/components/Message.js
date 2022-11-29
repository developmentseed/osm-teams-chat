import {
  Stack,
  Text,
  Flex,
  Avatar,
  AvatarBadge,
  HStack,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { MapText } from "./MapText";
import MessageText from "./MessageText";

function MessageBody({ messageData }) {
  return (
    <Stack spacing={0}>
      {messageData.type === "map" ? (
        <MapText feature={messageData.text}></MapText>
      ) : (
        <MessageText>{messageData.text}</MessageText>
      )}
    </Stack>
  );
}

export default function Message({ messageData, isMyMessage }) {
  if (isMyMessage) {
    return (
      <Flex w="100%" direction="column" alignItems="flex-end" mb={2}>
        <HStack alignItems="center" spacing={1} mb={1}>
          <Avatar name={messageData.from} size="sm">
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <Text fontWeight="bold" fontSize="sm">
            {messageData.from}
          </Text>
          <Text fontSize="xs" fontWeight="light">
            {DateTime.fromMillis(messageData.timestamp).toRelative()}
          </Text>
        </HStack>
        <Flex
          bg="brand.500"
          color="white"
          minW="100px"
          my={1}
          p={3}
          rounded={6}
        >
          <MessageBody messageData={messageData} />
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex w="100%" mb="2">
        <Stack>
          <HStack alignItems={"center"} spacing={1} mb={1}>
            <Avatar name={messageData.from} size="sm">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text fontWeight="bold" fontSize="sm">
              {messageData.from}
            </Text>
            <Text fontSize={"xs"} fontWeight={"light"}>
              {DateTime.fromMillis(messageData.timestamp).toRelative()}
            </Text>
          </HStack>
          <Flex
            bg="brand.50"
            color="black"
            minW="400px"
            my="1"
            p="3"
            rounded={6}
          >
            <MessageBody messageData={messageData} />
          </Flex>
        </Stack>
      </Flex>
    );
  }
}
