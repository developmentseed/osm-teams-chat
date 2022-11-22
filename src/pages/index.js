import NextLink from "next/link";
import { assoc } from 'ramda'
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

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

const TeamListPage = ({ availableTeams, onSignOut }) => (
  <Flex height="100vh" alignItems="center" justifyContent="center">
    <Flex direction="column" background="gray.100" w={400} p={12} rounded={6}>
      <Heading mb={6}>OSM Teams Chat</Heading>
      {availableTeams.length > 0 ? (
        <>
          <Text mb={6}>Select a channel to join:</Text>
          {availableTeams.map((t) => (
            <NextLink key={t.id} href={`/channel/${t.id}`} passHref>
              <Button as="a" colorScheme="teal" m={2} justifyContent="left">
                {t.name}
              </Button>
              <span>{t.moderator ? "mod" : "member"}</span>
            </NextLink>
          ))}{" "}
        </>
      ) : (
        <Text mb={6}>There are no teams available.</Text>
      )}

      <Button colorScheme="teal" onClick={onSignOut} mt={5}>
        Sign out
      </Button>
    </Flex>
  </Flex>
);

async function getMyTeams (accessToken) {
  if (!accessToken) return []
  return fetch('https://mapping.team/api/my/teams', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then((response) => response.json())
  .then((data) => {
    if (data) {
      const memberOf = data.member
      const moderatorOf = data.moderator

      const teams = memberOf.map(team => {
        for (let moderatedTeam of moderatorOf) {
          if (moderatedTeam.id === team.id) {
            return assoc('moderator', true, team)
          }
        }
      })
      return teams
    } else {
      return [];
    }
  })
}

export default function Home() {
  const { status, data } = useSession();
  const [availableTeams, setAvailableTeams] = useState([]);

  let accessToken;
  if (data) {
    accessToken = data.accessToken;
  }

  useEffect(() => {
    getMyTeams(accessToken)
    .then((teams) => {
      setAvailableTeams(teams)
    })
  }, [accessToken])

  if (status === "loading") return null;

  const isAuthenticated = status === "authenticated";

  return isAuthenticated ? (
    <TeamListPage availableTeams={availableTeams} onSignOut={signOut} />
  ) : (
    <SignInBox onSignIn={() => signIn("osm-teams")} />
  );
}
