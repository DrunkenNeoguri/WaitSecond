import React, { Dispatch, SetStateAction } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Link, Text, useToast } from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { loginStateCheck } from "../../utils/verifiedcheck";
import { firebaseConfig } from "../../utils/firestore.setting";
const CommonMenu: React.FC<{
  close: Dispatch<SetStateAction<boolean>>;
}> = ({ close }) => {
  const db = getFirestore();
  const firebaseAuth = getAuth();
  const navigate = useNavigate();
  const toastMsg = useToast();
  // const currentUser = firebaseAuth.currentUser?.uid;

  // 관리자가 설정한 매장 관리 정보 가져오기
  const getStoreOption = async () => {
    const storeDataState = await getDocs(collection(db, "adminList")).then(
      (data) => {
        let adminData: any;
        data.forEach((doc) => {
          if (doc.data().uid === loginStateCheck()) {
            return (adminData = doc.data());
          }
        });
        return adminData;
      }
    );
    return storeDataState;
  };

  const { data } = useQuery({
    queryKey: ["storeOption"],
    queryFn: getStoreOption,
  });

  const signOutToPage = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut(firebaseAuth).then(() => {
      const sessionKey = `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`;
      sessionStorage.removeItem(sessionKey);
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
            <Text fontWeight="semibold" margin="0 0.25rem">
              {`${data.storeName} 님`}
            </Text>
          </Flex>
          <Button background="none" padding="0" onClick={() => close(false)}>
            <CloseIcon fontSize="xl" />
          </Button>
        </Flex>
        <Flex
          direction="column"
          width="50vw"
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
          >
            설정
          </Link>
        </Flex>
        <Flex margin="auto 0 0 0">
          <Button
            background="none"
            border="none"
            fontSize="1rem"
            color="#FFFFFF"
            padding="0 0.25rem"
            onClick={signOutToPage}
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
