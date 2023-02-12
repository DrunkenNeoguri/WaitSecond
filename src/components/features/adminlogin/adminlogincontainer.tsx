import { Button, Flex, FormControl, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

const AdminLoginContainer = () => {
  const initialState = new AdminData("", "");

  const [loginData, setLoginData] = useState<AdminData>(initialState);

  const inputLoginData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setLoginData({ ...loginData, [id]: value });
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
        관리자 로그인
      </Heading>
      <form>
        <FormControl>
          <CommonInput
            direction="column"
            id="email"
            title="이메일 아이디"
            type="email"
            value={loginData.email}
            onChange={inputLoginData}
            margin="1.25rem 0"
          />
          <CommonInput
            direction="column"
            id="password"
            title="비밀번호"
            type="password"
            value={loginData.password!}
            onChange={inputLoginData}
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
            margin="3rem 0 1rem 0"
          >
            로그인
          </Button>
          <Button
            type="button"
            variant="solid"
            background="#5A5A5A"
            padding="0.5rem auto"
            fontSize="1.25rem"
            borderRadius="0.25rem"
            color="#ffffff"
            width="100%"
            height="3rem"
            margin="1rem 0"
          >
            회원가입
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminLoginContainer;
