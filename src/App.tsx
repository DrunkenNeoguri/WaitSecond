import React from "react";
import Router from "./router/router";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./utils/chakraextend";
import { RecoilRoot } from "recoil";
import { firebaseConfig } from "./utils/firestore.setting";
import { initializeApp } from "firebase/app";

function App() {
  initializeApp(firebaseConfig);

  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Router />
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default App;
