import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { emailRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

const AdminEmailCheckContainer = () => {
  const initialState = new AdminData("");

  const [emailCheckData, setEmailCheckData] = useState<AdminData>(initialState);
  const [inputCheck, setInputCheck] = useState(false);

  const inputSignUpData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setEmailCheckData({ ...emailCheckData, [id]: value });
    if (inputCheck === false) {
      setInputCheck(true);
    }
  };

  /// Toast 메시지를 띄워주게 할 것
  const submitEmailData = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailCheckData.email.trim() === "") {
      return alert("ㅁ");
    } else if (emailRegex.test(emailCheckData.email) === false) {
      return alert("ㄴ");
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
        이메일 인증
      </Heading>
      <Flex
        direction="column"
        fontSize="1rem"
        lineHeight="1.5rem"
        whiteSpace="pre-wrap"
        textAlign="left"
        letterSpacing="-1px"
        margin="1rem 0"
        gap="1rem"
      >
        <Text>
          입력하신 이메일이 가입자 본인이 맞는지 확인하기 위해, 이메일을
          인증해주세요.
        </Text>
        <Text>
          본인 인증을 하지 않으실 경우, 서비스 이용이 제한될 수 있습니다.
        </Text>
      </Flex>

      <form onSubmit={submitEmailData}>
        <FormControl>
          <CommonInput
            direction="column"
            id="email"
            title="입력한 이메일"
            type="email"
            value={emailCheckData.email}
            onChange={inputSignUpData}
            margin="1rem 0 0 0"
          />
          <Text color="red" marginBottom="1rem">
            {inputCheck === true
              ? emailCheckData.email.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : emailRegex.test(emailCheckData.email) === false
                ? "정확한 이메일을 입력해주십시오."
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
            margin="1rem 0"
            onClick={submitEmailData}
          >
            이메일 인증
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminEmailCheckContainer;
