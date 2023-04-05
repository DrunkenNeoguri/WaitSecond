import React from "react";
import { Flex, Link, useToast } from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { tokenExpirationCheck } from "../../../utils/verifiedcheck";
import { useQuery } from "@tanstack/react-query";
import { useMetaTag, useTitle } from "../../../utils/customhook";

const AdminSettingContainer: React.FC = () => {
  useTitle("설정 ::: 웨잇세컨드");
  useMetaTag({
    title: "설정 ::: 웨잇세컨드",
  });
  const toastMsg = useToast();
  const navigate = useNavigate();

  // 토큰이 만료됐는지 확인
  const expiredCheck = async () => {
    const expiredstate = await tokenExpirationCheck();
    return expiredstate;
  };

  useQuery({
    queryKey: ["tokenExpriedCheck"],
    queryFn: expiredCheck,
    onSuccess(data) {
      if (data === true) {
        if (!toastMsg.isActive("error-tokenExpired")) {
          return !toastMsg.isActive("error-tokenExpired")
            ? toastMsg({
                title: "계정 로그인 만료",
                id: "error-tokenExpired",
                description:
                  "오랫동안 페이지 내 활동이 없어 안전을 위해 로그인을 해제합니다. 다시 로그인해주세요.",
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            : null;
        }
        navigate("/adminlogin");
      }
    },
  });

  return (
    <Flex
      as="article"
      direction="column"
      border="none"
      padding="2rem 1.5rem"
      background="#FFFFFF"
      boxSizing="border-box"
      height="100%"
    >
      <Flex direction="column" padding="1rem 0" gap="2.5rem">
        <Link
          id="notice"
          fontSize="1.5rem"
          fontWeight="semibold"
          as={ReactRouterLink}
          to="/"
        >
          공지사항
        </Link>
        <Link
          id="help"
          fontSize="1.5rem"
          fontWeight="semibold"
          as={ReactRouterLink}
          to="/"
        >
          도움말 가이드
        </Link>
        <Link
          id="changepassword"
          fontSize="1.5rem"
          fontWeight="semibold"
          as={ReactRouterLink}
          to="/adminsetting/findpassword"
        >
          비밀번호 변경
        </Link>
        <Link
          id="withdrawal"
          fontSize="1.5rem"
          fontWeight="semibold"
          as={ReactRouterLink}
          to="/adminsetting/withdrawal"
        >
          회원 탈퇴
        </Link>
      </Flex>
    </Flex>
  );
};

export default AdminSettingContainer;
