import React, { Dispatch, SetStateAction } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { loginStateCheck } from "../../utils/verifiedcheck";
import { firebaseConfig } from "../../utils/firestore.setting";
import CommonQRCodeModal from "./commonqrcodemodal";
const CommonMenu: React.FC<{
  close: Dispatch<SetStateAction<boolean>>;
}> = ({ close }) => {
  const firebaseAuth = getAuth();
  const navigate = useNavigate();
  const toastMsg = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const signOutToPage = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut(firebaseAuth).then(() => {
      const sessionKey = `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`;
      sessionStorage.removeItem(sessionKey);
      sessionStorage.removeItem("storeName");
      if (!toastMsg.isActive("success-logout")) {
        toastMsg({
          title: "로그아웃",
          id: "success-logout",
          description: "성공적으로 로그아웃됐습니다.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      navigate("/adminlogin");
    });
  };

  const openQRCodeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen();
  };

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
      wordBreak="keep-all"
    >
      <CommonQRCodeModal isOpen={isOpen} onClose={onClose} />

      <Flex
        direction="column"
        height="100vh"
        background="mainBlue"
        width="70vw"
        maxWidth="30rem"
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
            <Text fontWeight="semibold" margin="0 0.25rem">
              {sessionStorage.getItem("storeName") === undefined
                ? ""
                : `${sessionStorage.getItem("storeName")} 님`}
            </Text>
          </Flex>
          <Button background="none" padding="0" onClick={() => close(false)}>
            <CloseIcon fontSize="xl" />
          </Button>
        </Flex>
        <Flex
          direction="column"
          width="50vw"
          maxWidth="20rem"
          padding="4rem 0"
          gap="1rem"
          margin="0 0.25rem"
        >
          <Link
            fontSize="1.25rem"
            fontWeight="semibold"
            color="#ffffff"
            as={ReactRouterLink}
            to="/adminwaitinglist"
            onClick={() => close(false)}
          >
            현재 대기 상황
          </Link>
          <Box height="0.125rem" background="#FFFFFF" />
          <Link
            fontSize="1.25rem"
            fontWeight="semibold"
            color="#ffffff"
            as={ReactRouterLink}
            to="/adminstoremanage"
            onClick={() => close(false)}
          >
            매장 관리
          </Link>
          <Box height="0.125rem" background="#FFFFFF" />
          <Link
            fontSize="1.25rem"
            fontWeight="semibold"
            color="#ffffff"
            as={ReactRouterLink}
            to="/adminsetting"
            onClick={() => close(false)}
          >
            설정
          </Link>
          <Box height="0.125rem" background="#FFFFFF" />

          <Link
            fontSize="1.25rem"
            fontWeight="semibold"
            color="#ffffff"
            as={ReactRouterLink}
            to={`/store/${loginStateCheck()}`}
            target="_blank"
            onClick={() => close(false)}
          >
            내 매장 페이지
          </Link>
        </Flex>
        <Flex
          direction="column"
          margin="auto 0 0 0"
          gap="0.5rem"
          align="flex-start"
        >
          <Button
            background="none"
            border="none"
            fontSize="1rem"
            color="#FFFFFF"
            padding="0"
            onClick={openQRCodeModal}
            _hover={{ background: "none", textDecoration: "underline" }}
          >
            임시 QR 코드 발급
          </Button>
          <Button
            background="none"
            border="none"
            fontSize="1rem"
            color="#FFFFFF"
            padding="0"
            onClick={signOutToPage}
            _hover={{ background: "none", textDecoration: "underline" }}
          >
            로그아웃
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CommonMenu;

//onClick={signOut(firebaseAuth)}
