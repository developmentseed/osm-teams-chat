import { useState } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";

const SignInBox = ({ onSignIn }) => (
  <Flex height="100vh" alignItems="center" justifyContent="center">
    <Flex direction="column" background="gray.100" w={400} p={12} rounded={6}>
      <Heading mb={6}>OSM Teams Chat</Heading>
      <Text mb={6}>
        Welcome! Please identify yourself to start using the app.
      </Text>
      <Button colorScheme="teal" onClick={onSignIn}>
        Sign in
      </Button>
    </Flex>
  </Flex>
);

const availableTeams = [
  {
    id: 1,
    displayName: "🇱🇧 Beirut Map & Chess",
  },
  {
    id: 2,
    displayName: "🌳 Specialized Tree Mappers",
  },
  {
    id: 3,
    displayName: "🇮🇳 Mappers of Goa",
  },
];

const TeamListPage = ({ onSignOut }) => (
  <Flex height="100vh" alignItems="center" justifyContent="center">
    <Flex direction="column" background="gray.100" w={400} p={12} rounded={6}>
      <Heading mb={6}>OSM Teams Chat</Heading>
      <Text mb={6}>Select a channel to join:</Text>
      {availableTeams.map((t) => (
        <Button key={t.id} colorScheme="teal" m={2} justifyContent='left'>
          {t.displayName}
        </Button>
      ))}

      <Button colorScheme="teal" onClick={onSignOut} mt={5}>
        Sign out
      </Button>
    </Flex>
  </Flex>
);

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <TeamListPage onSignOut={() => setIsAuthenticated(false)} />
  ) : (
    <SignInBox onSignIn={() => setIsAuthenticated(true)} />
  );
}
