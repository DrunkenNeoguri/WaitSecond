import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";

const AdminChangePasswordContainer: React.FC<{
  setPage: Dispatch<SetStateAction<string>>;
}> = ({ setPage }) => {
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
      <Heading as="h1" fontSize="1.5rem" padding="1rem 0">
        비밀번호 변경
      </Heading>
      <Text fontSize="0.75rem">새로 변경할 비밀번호를 입력해주세요.</Text>
      <form>
        <FormControl padding="1.5rem 0">
          <Flex direction="column" padding="0.25rem 0">
            <FormLabel htmlFor="password" fontSize="1rem" fontWeight="semibold">
              새 비밀번호
            </FormLabel>
            <Input id="password" />
            <Text fontSize="0.625rem" padding="0.25rem 0">
              잘못된 비밀번호 양식입니다.
            </Text>
          </Flex>
          <Flex direction="column" padding="0.25rem 0">
            <FormLabel
              htmlFor="passwordCheck"
              fontSize="1rem"
              fontWeight="semibold"
            >
              새 비밀번호 확인
            </FormLabel>
            <Input id="passwordCheck" />
            <Text fontSize="0.625rem" padding="0.25rem 0">
              잘못된 비밀번호 양식입니다.
            </Text>
          </Flex>
          <Flex direction="column" margin="1.5rem 0">
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
              margin="0.5rem 0"
            >
              비밀번호 변경
            </Button>
            <Button
              type="button"
              variant="solid"
              background="#8D8D8D"
              padding="0.5rem auto"
              fontSize="1.25rem"
              borderRadius="0.25rem"
              color="#ffffff"
              width="100%"
              height="3rem"
              margin="0.5rem 0"
              onClick={() => setPage("default")}
            >
              이전으로
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminChangePasswordContainer;
