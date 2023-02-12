import { Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

const AdminChangePasswordContainer = () => {
  const initialState = new AdminData("", "", "");

  const [passwordData, setPasswordData] = useState<AdminData>(initialState);

  const inputPasswordData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setPasswordData({ ...passwordData, [id]: value });
  };

  return (
    <Flex
      as="section"
      direction="column"
      position="relative"
      background="#ffffff"
      padding="2rem 1.5rem"
      margin="0 1rem"
      border="none"
      borderRadius="1rem"
      top="5.5rem"
      boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
    >
      <Heading as="h1" textAlign="center" marginBottom="2rem">
        웨잇세컨드
      </Heading>
      <Heading as="h2" fontSize="1.25rem">
        비밀번호 변경
      </Heading>
      <Text
        fontSize="1rem"
        lineHeight="1.5rem"
        whiteSpace="pre-wrap"
        textAlign="left"
        letterSpacing="-1px"
        margin="1rem 0"
      >
        새로 변경할 비밀번호를 입력해주세요.
      </Text>
      <form>
        <FormControl>
          <CommonInput
            direction="column"
            id="password"
            title="비밀번호"
            type="password"
            value={passwordData.password!}
            onChange={inputPasswordData}
            margin="1.25rem 0"
          />
          <CommonInput
            direction="column"
            id="passwordcheck"
            title="비밀번호 확인"
            type="password"
            value={passwordData.passwordcheck!}
            onChange={inputPasswordData}
            margin="1.25rem 0"
          />
          <Button
            type="submit"
            variant="solid"
            background="#5ABFB7"
            padding="0.5rem auto"
            fontSize="1.25rem"
            borderRadius="0.25rem"
            color="#ffffff"
            width="100%"
            height="3rem"
            marginTop="1rem"
          >
            비밀번호 변경
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminChangePasswordContainer;
