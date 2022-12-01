import { SessionProvider } from "next-auth/react";
import {
  ChakraProvider,
  withDefaultColorScheme,
  extendTheme,
} from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#ECEEF8",
    100: "#CAD0EC",
    200: "#A8B2E0",
    300: "#8794D4",
    400: "#6576C8",
    500: "#4358BC",
    600: "#354797",
    700: "#283571",
    800: "#1B234B",
    900: "#0D1226",
  },
};

const components = {
  Button: {
    variants: {
      solid: {
        borderRadius: 0,
        textTransform: "uppercase",
        _hover: {
          bg: "brand.600",
          color: "#FFFFFF",
        },
      },
    },
  },
};

const theme = extendTheme(
  { colors, components },
  withDefaultColorScheme({ colorScheme: "brand" })
);

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}

export default App;
