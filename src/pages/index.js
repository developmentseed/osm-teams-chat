import SignInBox from "../components/signin";
import { HStack } from "@chakra-ui/react";
import { useSession, signIn } from "next-auth/react";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") return null;

  const isAuthenticated = status === "authenticated";

  return isAuthenticated ? (
    <HStack>
      <Sidebar />
    </HStack>
  ) : (
    <SignInBox onSignIn={() => signIn("osm-teams")} />
  );
}
