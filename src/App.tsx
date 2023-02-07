import React from "react";
import Router from "./router/router";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./utils/chakraextend";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Router />
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default App;
