import React from "react";
import { Flex, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const AdminSettingContainer: React.FC = () => {
  return (
    <Flex
      as="article"
      direction="column"
      border="none"
      borderRadius="1rem 1rem 0 0"
      boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
      padding="4.5rem 1.5rem"
      background="#FFFFFF"
      boxSizing="border-box"
      height="100vh"
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
