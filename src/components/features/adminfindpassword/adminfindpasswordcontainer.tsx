import { Flex, Heading, FormControl, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

const AdminFindPasswordContainer = () => {
  const initialState = new AdminData("");

  const [emailData, setEmailData] = useState<AdminData>(initialState);

  const inputEmailData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setEmailData({ ...emailData, [id]: value });
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
        비밀번호 찾기
      </Heading>
      <Text
        fontSize="1rem"
        lineHeight="1.5rem"
        whiteSpace="pre-wrap"
        textAlign="left"
        letterSpacing="-1px"
        margin="1rem 0"
      >
        등록하신 이메일 주소를 입력해주세요.
      </Text>
      <form>
        <FormControl>
          <CommonInput
            direction="column"
            id="email"
            title="가입한 이메일 주소"
            type="email"
            value={emailData.email}
            onChange={inputEmailData}
            margin="1rem 0"
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
            margin="1rem 0"
          >
            이메일 전송
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminFindPasswordContainer;