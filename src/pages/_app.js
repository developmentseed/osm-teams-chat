import { SessionProvider } from "next-auth/react";
import {
  ChakraProvider,
  withDefaultColorScheme,
  extendTheme,
} from "@chakra-ui/react";

const colors = {
  brand: {
    900: "rgba(56, 74, 158, 0.9)",
    800: "rgba(56, 74, 158, 0.8)",
    700: "rgba(56, 74, 158, 0.7)",
    600: "rgba(56, 74, 158, 0.6)",
    500: "rgba(56, 74, 158, 0.5)",
    400: "rgba(56, 74, 158, 0.4)",
    300: "rgba(56, 74, 158, 0.3)",
    200: "rgba(56, 74, 158, 0.2)",
    100: "rgba(56, 74, 158, 0.1)",
  },
};

const components = {
  Button: {
    variants: {
      solid: {
        bg: "brand.900",
        color: "#FFFFFF",
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
