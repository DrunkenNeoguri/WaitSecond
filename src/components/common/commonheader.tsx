import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { faLanguage, faLowVision } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { lowVisionState } from "../../modules/atoms/atoms";
import AdminRegisterModal from "../features/adminwaitinglist/adminregistermodal";
import CommonMenu from "./commonmenu";

const CommonHeader: React.FC<{
  children?: React.ReactNode;
  page: "admin" | "user" | "none";
}> = (props) => {
  const [visionState, setVisionState] = useRecoilState<boolean>(lowVisionState);
  const [menuState, setMenuState] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  //Func - change font size when user clicked low vision button
  const changeLowVisionState = (e: React.MouseEvent) => {
    e.preventDefault();
    setVisionState(!visionState);
  };

  return (
    <>
      {menuState ? <CommonMenu close={setMenuState} /> : <></>}
      <Flex
        as="nav"
        background="mainBlue"
        width="100vw"
        height="3.5rem"
        display="flex"
        justify="space-between"
        align="center"
        color="#ffffff"
        padding="1rem"
        position="fixed"
        zIndex="3"
        top="0"
      >
        {props.page === "admin" ? (
          <>
            <AdminRegisterModal isOpen={isOpen} onClose={onClose} />
            <Flex gap="0.5rem" align="center">
              <Button
                background="none"
                padding="0"
                onClick={() => setMenuState(!menuState)}
              >
                <HamburgerIcon fontSize="2xl" pointerEvents="none" />
              </Button>
              <Text fontSize="1rem">김천재의 육회바른연어</Text>
            </Flex>
            {location.pathname === "/adminwaitinglist" ? (
              <Button background="none" padding="0" onClick={onOpen}>
                <AddIcon fontSize="xl" />
              </Button>
            ) : (
              <></>
            )}
          </>
        ) : props.page === "user" ? (
          <>
            <Button
              background="none"
              color="#ffffff"
              fontSize="1.625rem"
              padding="0"
              onClick={changeLowVisionState}
              _hover={{
                background: "#ffffff",
                color: "#000000",
              }}
            >
              <FontAwesomeIcon icon={faLowVision} />
              {`저시력`}
            </Button>
            <Button
              background="none"
              color="#ffffff"
              padding="0"
              _hover={{
                color: "#5ABFB7",
              }}
            >
              <FontAwesomeIcon
                icon={faLanguage}
                style={{ height: "2.25rem", width: "2.25rem" }}
              />
            </Button>
          </>
        ) : (
          <></>
        )}
      </Flex>
    </>
  );
};

export default CommonHeader;
