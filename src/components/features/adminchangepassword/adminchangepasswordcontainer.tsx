import { Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { passwordRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

const AdminChangePasswordContainer = () => {
  const initialState = new AdminData("", "", "");

  const [passwordData, setPasswordData] = useState<AdminData>(initialState);
  const [inputCheck, setInputCheck] = useState({
    password: false,
    passwordcheck: false,
  });

  const inputPasswordData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setPasswordData({ ...passwordData, [id]: value });

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, password: true });
    }

    if (e.target.id === "passwordcheck" && inputCheck.passwordcheck === false) {
      setInputCheck({ ...inputCheck, passwordcheck: true });
    }
  };

  const submitPasswordData = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      passwordData.password?.trim() === "" ||
      passwordData.passwordcheck?.trim() === ""
    ) {
      return alert("ㅁ");
    } else if (
      passwordData.password?.trim() !== passwordData.passwordcheck?.trim()
    ) {
      return alert("ㄴ");
    } else if (
      passwordRegex.test(passwordData.password!) === false ||
      passwordRegex.test(passwordData.passwordcheck!) === false
    ) {
      return alert("ㅇ");
    }

    alert("그렇지");
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
      <form onSubmit={submitPasswordData}>
        <FormControl>
          <CommonInput
            direction="column"
            id="password"
            title="비밀번호"
            type="password"
            value={passwordData.password!}
            onChange={inputPasswordData}
            margin="1.25rem 0 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck.password === true
              ? passwordData.password!.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : passwordRegex.test(passwordData.password!) === false
                ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                : "　"
              : "　"}
          </Text>

          <CommonInput
            direction="column"
            id="passwordcheck"
            title="비밀번호 확인"
            type="password"
            value={passwordData.passwordcheck!}
            onChange={inputPasswordData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck.passwordcheck === true
              ? passwordData.passwordcheck!.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : passwordRegex.test(passwordData.passwordcheck!) === false
                ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                : passwordData.password!.trim() !==
                  passwordData.passwordcheck!.trim()
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
            onClick={submitPasswordData}
          >
            비밀번호 변경
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminChangePasswordContainer;
