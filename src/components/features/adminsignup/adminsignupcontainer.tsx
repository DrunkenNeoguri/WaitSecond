import { Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { CommonInput } from "../../common/commoninput";
import { AdminData, EventObject } from "../../../utils/typealies";
import { emailRegex, passwordRegex } from "../../../utils/reqlist";

const AdminSignUpContainer: React.FC = () => {
  const initialState = new AdminData("", "", "");

  const [signUpData, setSignUpData] = useState<AdminData>(initialState);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
    passwordcheck: false,
  });

  const inputSignUpData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setSignUpData({ ...signUpData, [id]: value });

    if (e.target.id === "email" && inputCheck.email === false) {
      setInputCheck({ ...inputCheck, email: true });
    }

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, password: true });
    }

    if (e.target.id === "passwordcheck" && inputCheck.passwordcheck === false) {
      setInputCheck({ ...inputCheck, passwordcheck: true });
    }
  };

  const submitSignUpData = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      signUpData.email.trim() === "" ||
      signUpData.password?.trim() === "" ||
      signUpData.passwordcheck?.trim() === ""
    ) {
      return alert("ㅁ");
    } else if (emailRegex.test(signUpData.email) === false) {
      return alert("ㄴ");
    } else if (
      passwordRegex.test(signUpData.password!) === false ||
      passwordRegex.test(signUpData.passwordcheck!) === false
    ) {
      return alert("ㅇ");
    } else if (signUpData.password! !== signUpData.passwordcheck!) {
      return alert("ㄹ");
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
        회원가입
      </Heading>
      <form onSubmit={submitSignUpData}>
        <FormControl>
          <CommonInput
            direction="column"
            id="email"
            title="이메일 아이디"
            type="email"
            value={signUpData.email}
            onChange={inputSignUpData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck.email === true
              ? signUpData.email.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : emailRegex.test(signUpData.email) === false
                ? "정확한 이메일을 입력해주십시오."
                : "　"
              : "　"}
          </Text>

          <CommonInput
            direction="column"
            id="password"
            title="비밀번호"
            type="password"
            value={signUpData.password!}
            onChange={inputSignUpData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck.password === true
              ? signUpData.password!.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : passwordRegex.test(signUpData.password!) === false
                ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                : "　"
              : "　"}
          </Text>

          <CommonInput
            direction="column"
            id="passwordcheck"
            title="비밀번호 확인"
            type="password"
            value={signUpData.passwordcheck!}
            onChange={inputSignUpData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck.passwordcheck === true
              ? signUpData.passwordcheck!.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : passwordRegex.test(signUpData.passwordcheck!) === false
                ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                : signUpData.password!.trim() !==
                  signUpData.passwordcheck!.trim()
                ? "비밀번호가 일치하지 않습니다."
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
            marginTop="1rem"
            onClick={submitSignUpData}
          >
            다음으로
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminSignUpContainer;
