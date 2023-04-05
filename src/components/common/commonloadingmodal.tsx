import React from "react";
import { Flex, Spinner } from "@chakra-ui/react";

const CommonLoadingModal: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      position="fixed"
      zIndex="15"
      background="rgba(66, 66, 66, 30%)"
      top="0"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="#FFFFFF"
        color="mainBlue"
        size="xl"
      />
    </Flex>
  );
};

export default CommonLoadingModal;
