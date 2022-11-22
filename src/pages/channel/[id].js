import { useState } from "react";
import NextLink from "next/link";
import { Text, Button, Flex, Heading } from "@chakra-ui/react";

const messages = [
  { from: "marc", text: "Hello", timestamp: 1669042245033 },
  { from: "vitor", text: "Hi", timestamp: 1669042245133 },
  { from: "marc", text: "How are you?", timestamp: 1669042245233 },
  { from: "vitor", text: "I'm doing great, thanks", timestamp: 1669042245333 },
];

export default function ChannelView() {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" w={400} p={12} rounded={6}>
        <Heading mb={6}>OSM Teams Chat</Heading>
        {messages.map((m) => (
          <Text key={m.timestamp}>
            {m.from}: {m.text}{" "}
          </Text>
        ))}
        <NextLink href={`/`} passHref>
          <Button colorScheme="teal" mt={5}>
            Back to home page
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
}
