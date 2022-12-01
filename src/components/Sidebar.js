import NextLink from "next/link";
import {
  Stack,
  Flex,
  Heading,
  Button,
  Text,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const [loading, setLoading] = useState(true);
  const [availableTeams, setAvailableTeams] = useState([]);
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.accessToken) return;
    fetch("/api/chat/teams", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((teams) => {
        setLoading(false);
        setAvailableTeams(teams);
      });
  }, [status, loading, session]);

  return (
    <Stack
      height="100vh"
      direction="column"
      background="brand.700"
      alignItems="left"
      justifyContent="space-between"
      borderRight="1px"
      borderColor="black.200"
      boxShadow={"md"}
    >
      <Flex direction="column" minW={"280"} color="gray.200">
        <Heading as={NextLink} size={"md"} p={4} href="/">
          OSM Teams Chat
        </Heading>
        <Divider borderColor="gray.500" />
        {loading ? (
          <Spinner m={4} />
        ) : availableTeams.length > 0 ? (
          <Flex direction="column">
            <Text
              w="full"
              textTransform={"uppercase"}
              letterSpacing={"wider"}
              fontSize={"xs"}
              display={"flex"}
              color="gray.400"
              p={4}
            >
              Available Teams
            </Text>
            {availableTeams.map((t) => (
              <Button
                as={NextLink}
                size="xs"
                justifyContent="left"
                key={t.id}
                href={`/channel/${t.id}`}
                passHref
                px={4}
                backgroundColor={"brand.700"}
                textTransform="normal"
              >
                # {t.name}
              </Button>
            ))}{" "}
          </Flex>
        ) : (
          <Text p={4}>No teams available</Text>
        )}
      </Flex>
      <Button onClick={() => signOut()} mt={5}>
        Sign out
      </Button>
    </Stack>
  );
}
