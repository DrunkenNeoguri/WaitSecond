import React, { Dispatch, SetStateAction } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const CommonMenu: React.FC<{
  close: Dispatch<SetStateAction<boolean>>;
}> = ({ close }) => {
  return (
    <Box
      background="rgba(38, 38, 38, 40%)"
      display="block"
      width="100vw"
      height="100vh"
      position="fixed"
      top="0"
      zIndex="5"
      overflow="scroll"
    >
      <Flex
        direction="column"
        height="100vh"
        background="#4E95FF"
        width="70vw"
        align="flex-start"
        padding="1rem"
      >
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          color="#ffffff"
          width="100%"
        >
          <Flex>
            developneoguri{" "}
            <Text fontWeight="semibold" margin="0 0.25rem">
              님
            </Text>
          </Flex>
          <Button background="none" padding="0" onClick={() => close(false)}>
            <CloseIcon fontSize="xl" />
          </Button>
        </Flex>
        <Flex direction="column" width="50vw" padding="4rem 0" gap="1rem">
          <Link
            fontSize="1.25rem"
            fontWeight="semibold"
            color="#ffffff"
            as={ReactRouterLink}
            to=""
          >
            현재 대기 상황
          </Link>
          <Box height="0.125rem" background="#FFFFFF" />
          <Link
            fontSize="1.25rem"
            fontWeight="semibold"
            color="#ffffff"
            as={ReactRouterLink}
            to="/adminsetting"
          >
            상점 관리
          </Link>
          <Box height="0.125rem" background="#FFFFFF" />
          <Link
            fontSize="1.25rem"
            fontWeight="semibold"
            color="#ffffff"
            as={ReactRouterLink}
            to=""
          >
            설정
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CommonMenu;
