import { Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { emailRegex, passwordRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

const AdminLoginContainer = () => {
  const initialState = new AdminData("", "");

  const [loginData, setLoginData] = useState<AdminData>(initialState);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
  });

  const inputLoginData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setLoginData({ ...loginData, [id]: value });

    if (e.target.id === "email" && inputCheck.email === false) {
      setInputCheck({ ...inputCheck, email: true });
    }

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, password: true });
    }
  };

  const submitLoginData = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email.trim() === "" || loginData.password?.trim() === "") {
      return alert("ㅁ");
    } else if (emailRegex.test(loginData.email) === false) {
      return alert("ㄴ");
    } else if (passwordRegex.test(loginData.password!) === false) {
      return alert("ㅇ");
    }

    return console.log("성공");
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
      <form onSubmit={submitLoginData}>
        <FormControl>
          <CommonInput
            direction="column"
            id="email"
            title="이메일 아이디"
            type="email"
            value={loginData.email}
            onChange={inputLoginData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1rem">
            {inputCheck.email === true
              ? loginData.email.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : emailRegex.test(loginData.email) === false
                ? "정확한 이메일을 입력해주십시오."
                : "　"
              : "　"}
          </Text>
          <CommonInput
            direction="column"
            id="password"
            title="비밀번호"
            type="password"
            value={loginData.password!}
            onChange={inputLoginData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck.password === true
              ? loginData.password!.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : passwordRegex.test(loginData.password!) === false
                ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                : "　"
              : "　"}
          </Text>
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
            margin="1.5rem 0 1rem 0"
          >
            로그인
          </Button>
          <Button
            type="submit"
            variant="solid"
            background="#5A5A5A"
            padding="0.5rem auto"
            fontSize="1.25rem"
            borderRadius="0.25rem"
            color="#ffffff"
            width="100%"
            height="3rem"
            margin="1rem 0"
            onClick={submitLoginData}
          >
            회원가입
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminLoginContainer;
