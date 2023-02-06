import React from "react";
import Router from "./router/router";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./utils/chakraextend";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router />
    </ChakraProvider>
  );
}

export default App;
