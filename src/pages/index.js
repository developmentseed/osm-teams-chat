import SignInBox from "./signin";
import { HStack } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const { status, data } = useSession();
  const [availableTeams, setAvailableTeams] = useState([]);

  let accessToken;
  if (data) {
    accessToken = data.accessToken;
  }

  useEffect(() => {
    fetch("/api/chat/teams", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((teams) => {
        setAvailableTeams(teams);
      });
  }, [accessToken]);

  if (status === "loading") return null;

  const isAuthenticated = status === "authenticated";

  return isAuthenticated ? (
    <HStack>
      <Sidebar availableTeams={availableTeams} onSignOut={signOut} />
    </HStack>
  ) : (
    <SignInBox onSignIn={() => signIn("osm-teams")} />
  );
}
