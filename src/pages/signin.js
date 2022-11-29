import { Button, Flex, Heading, Text } from "@chakra-ui/react";

const SignInBox = ({ onSignIn }) => (
  <Flex height="100vh" alignItems="center" justifyContent="center">
    <Flex direction="column" background="gray.100" w={400} p={12} rounded={6}>
      <Heading mb={6}>OSM Teams Chat</Heading>
      <Text mb={6}>
        Welcome! Please identify yourself to start using the app.
      </Text>
      <Button onClick={onSignIn}>Sign in</Button>
    </Flex>
  </Flex>
);

export default SignInBox;
