import React, { Dispatch, SetStateAction } from "react";
import { Flex, Text } from "@chakra-ui/react";

const AdminSettingContainer: React.FC<{
  setPage: Dispatch<SetStateAction<string>>;
}> = ({ setPage }) => {
  const changePageState = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(e.currentTarget.id);
    setPage(e.currentTarget.id);
  };

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
        <Text
          id="notice"
          fontSize="1.5rem"
          fontWeight="semibold"
          onClick={changePageState}
          cursor="pointer"
        >
          공지사항
        </Text>
        <Text
          id="help"
          fontSize="1.5rem"
          fontWeight="semibold"
          onClick={changePageState}
          cursor="pointer"
        >
          도움말 가이드
        </Text>
        <Text
          id="changepassword"
          fontSize="1.5rem"
          fontWeight="semibold"
          onClick={changePageState}
          cursor="pointer"
        >
          비밀번호 변경
        </Text>
        <Text
          id="withdrawal"
          fontSize="1.5rem"
          fontWeight="semibold"
          onClick={changePageState}
          cursor="pointer"
        >
          회원 탈퇴
        </Text>
      </Flex>
    </Flex>
  );
};

export default AdminSettingContainer;
