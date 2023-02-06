import { Button, Flex } from "@chakra-ui/react";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const CommonHeader: React.FC<{
  children?: React.ReactNode;
  page: "admin" | "user";
}> = (props) => {
  return (
    <Flex
      as="nav"
      background="#5a5a5a"
      width="100vw"
      height="3.5rem"
      display="flex"
      justify="space-between"
      align="center"
      padding="0.625rem"
      position="fixed"
      zIndex="3"
      top="0"
    >
      {props.page === "admin" ? (
        <>
          <Button>예</Button>
          <Button>예</Button>
        </>
      ) : (
        <>
          <Button background="none" color="#ffffff" fontSize="1.25rem">
            저시력
          </Button>
          <Button background="none">
            <FontAwesomeIcon
              icon={faGlobe}
              color="#ffffff"
              style={{ height: "2.25rem", width: "2.25rem" }}
            />
          </Button>
        </>
      )}
    </Flex>
  );
};

export default CommonHeader;
