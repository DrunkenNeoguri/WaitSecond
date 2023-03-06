import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";

const AdminWithdrawalContainer: React.FC<{
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
      height="auto"
    >
      <Heading as="h1" fontSize="1.5rem" padding="1rem 0">
        회원 탈퇴
      </Heading>
      <Text fontSize="1rem">
        탈퇴 전, 아래의 내용을 읽어주시고 탈퇴를 희망하신다면 하단의 버튼을
        눌러주세요.
      </Text>
      <List
        display="flex"
        flexDirection="column"
        gap="1rem"
        fontSize="0.75rem"
        margin="1rem 0"
        wordBreak="keep-all"
      >
        <ListItem display="flex" flexDirection="row">
          <CheckCircleIcon color="green.500" margin="0.25rem 0.5rem" />
          <Text>
            회원 탈퇴를 진행하시면, 본 서비스를 이용하실 수 없게 되며 계정
            복구를 도와드리지 않습니다.
          </Text>
        </ListItem>
        <ListItem display="flex" flexDirection="row">
          <CheckCircleIcon color="green.500" margin="0.25rem 0.5rem" />
          <Text>
            탈퇴 시, 대기 예약을 위해 사용하신 QR 코드는 더 이상 사용하실 수
            없습니다.
          </Text>
        </ListItem>
        <ListItem display="flex" flexDirection="row">
          <CheckCircleIcon color="green.500" margin="0.25rem 0.5rem" />
          <Text>
            계정이 삭제되면서 같은 아이디로 재가입을 하셔도 본 서비스 이용 시에
            설정하신 사항은 모두 초기화됩니다.
          </Text>
        </ListItem>
      </List>
      <Button
        type="button"
        display="block"
        background="#5ABFB7"
        fontSize="1.25rem"
        borderRadius="0.25rem"
        color="#ffffff"
        width="100%"
        height="3rem"
        margin="0.5rem 0"
      >
        동의합니다
      </Button>
      <form>
        <FormControl padding="3rem 0 0 0">
          <Text fontSize="1rem">
            회원 탈퇴를 위해 이용 중이신 이메일 아이디와 비밀번호를
            입력해주십시오.
          </Text>
          <Flex direction="column" padding="1.5rem 0">
            <Flex direction="column" padding="0.25rem 0">
              <FormLabel htmlFor="email" fontSize="1rem" fontWeight="semibold">
                이메일 아이디
              </FormLabel>
              <Input id="email" />
              <Text fontSize="0.625rem" padding="0.25rem 0">
                잘못된 이메일 양식입니다.
              </Text>
            </Flex>
            <Flex direction="column" padding="0.25rem 0">
              <FormLabel
                htmlFor="password"
                fontSize="1rem"
                fontWeight="semibold"
              >
                비밀번호
              </FormLabel>
              <Input id="password" />
              <Text fontSize="0.625rem" padding="0.25rem 0">
                잘못된 비밀번호 양식입니다.
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column">
            <Button
              type="submit"
              background="#5ABFB7"
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
              background="#8D8D8D"
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

export default AdminWithdrawalContainer;
