import { AddIcon, ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { faLanguage, faLowVision } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const day = ["일", "월", "화", "수", "목", "금", "토"];
  const location = useLocation();
  const navigate = useNavigate();
  const nowDate = new Date();

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
            <Flex
              direction="row"
              gap="0.5rem"
              align="center"
              width="100%"
              justify="space-between"
            >
              <Button
                background="none"
                padding="0"
                onClick={() => setMenuState(!menuState)}
              >
                <HamburgerIcon fontSize="2xl" pointerEvents="none" />
              </Button>
              {location.pathname === "/adminwaitinglist" ? (
                <>
                  <Box
                    background="#FFFFFF"
                    color="#333333"
                    padding="0.25rem 1rem"
                    fontSize="1rem"
                    fontWeight="semibold"
                    borderRadius="0.25rem"
                  >
                    {`${nowDate.getFullYear()}.
                    ${
                      nowDate.getMonth() < 10
                        ? `0${nowDate.getMonth() + 1}`
                        : nowDate.getMonth() + 1
                    }.
                    ${
                      nowDate.getDate() < 10
                        ? `0${nowDate.getDate()}`
                        : nowDate.getDate()
                    }. (${day[nowDate.getDay()]})`}
                  </Box>
                  <Button background="none" padding="0" onClick={onOpen}>
                    <AddIcon fontSize="xl" />
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Flex>
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
        ) : location.pathname !== "/adminlogin" ? (
          <Button
            background="none"
            color="#ffffff"
            padding="0"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon fontSize="2xl" />
          </Button>
        ) : (
          <></>
        )}
      </Flex>
    </>
  );
};

export default CommonHeader;
