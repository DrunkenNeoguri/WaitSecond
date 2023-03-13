import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";

const AdminStoreManageContainer = () => {
  return (
    <Flex
      as="article"
      direction="column"
      border="none"
      borderRadius="1rem 1rem 0 0"
      boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
      padding="4.5rem 1rem 3rem 1rem"
      background="#FFFFFF"
      boxSizing="border-box"
    >
      <Heading as="h1" fontSize="1.5rem" padding="1rem 0">
        매장 관리
      </Heading>
      <form>
        <FormControl>
          <Flex direction="column" padding="0.5rem 0">
            <FormLabel fontSize="1rem" fontWeight="semibold">
              매장명
            </FormLabel>
            <Input />
            <Text fontSize="0.625rem" padding="0.25rem 0">
              aaa
            </Text>
          </Flex>
          <Flex direction="column" padding="0.5rem 0">
            <FormLabel fontSize="1rem" fontWeight="semibold">
              매장 아이디
            </FormLabel>
            <Input placeholder="20글자 이내 (영어 소문자, _ 가능)" />
            <Text fontSize="0.625rem" padding="0.25rem 0">
              aaa
            </Text>
          </Flex>

          <Flex direction="column" padding="1.5rem 0">
            <FormLabel fontSize="1rem" fontWeight="semibold">
              배경 이미지
            </FormLabel>
            <Box background="#8D8D8D" width="326px" height="180px" />
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
              배경 이미지 변경
            </Button>
          </Flex>

          <Flex direction="column" padding="0.5rem 0" gap="1rem">
            <FormLabel fontSize="1rem" fontWeight="semibold">
              대기 설정
            </FormLabel>
            <Flex direction="row" justify="space-between" align="center">
              <Text fontSize="0.875rem">현재 대기 접수 여부</Text>
              <Flex>
                <Button
                  borderRadius="0.25rem 0 0 0.25rem"
                  padding="0px 1.5rem"
                  background="#4E95FF"
                  color="#FFFFFF"
                  fontSize="0.75rem"
                  size="sm"
                >
                  가능
                </Button>
                <Button
                  borderRadius="0 0.25rem 0.25rem 0"
                  padding="0 1.5rem"
                  fontSize="0.75rem"
                  size="sm"
                >
                  불가
                </Button>
              </Flex>
            </Flex>
            <Flex direction="row" justify="space-between" align="center">
              <Text fontSize="0.875rem">최대 대기 접수 가능 인원</Text>
              <Flex justify="space-between" align="center" width="9rem">
                <Button background="#4E95FF" color="#FFFFFF" padding="0">
                  <MinusIcon />
                </Button>
                <Text>12명</Text>
                <Button background="#4E95FF" color="#FFFFFF" padding="0">
                  <AddIcon />
                </Button>
              </Flex>
            </Flex>
            <Flex direction="row" justify="space-between" align="center">
              <Text fontSize="0.875rem">최대 접수 가능 팀 수</Text>
              <Flex justify="space-between" align="center" width="9rem">
                <Button background="#4E95FF" color="#FFFFFF" padding="0">
                  <MinusIcon />
                </Button>
                <Text>12명</Text>
                <Button background="#4E95FF" color="#FFFFFF" padding="0">
                  <AddIcon />
                </Button>
              </Flex>
            </Flex>
            <Flex direction="row" justify="space-between" align="center">
              <Text fontSize="0.875rem">반려 동물 동반</Text>
              <Flex>
                <Button
                  borderRadius="0.25rem 0 0 0.25rem"
                  padding="0 1.5rem"
                  background="#4E95FF"
                  color="#FFFFFF"
                  fontSize="0.75rem"
                  size="sm"
                >
                  가능
                </Button>
                <Button
                  borderRadius="0 0.25rem 0.25rem 0"
                  padding="0 1.5rem"
                  fontSize="0.75rem"
                  size="sm"
                >
                  불가
                </Button>
              </Flex>
            </Flex>
            <Flex direction="row" justify="space-between" align="center">
              <Text fontSize="0.875rem">테이블 인원 따로 앉기</Text>
              <Flex>
                <Button
                  borderRadius="0.25rem 0 0 0.25rem"
                  padding="0 1.5rem"
                  background="#4E95FF"
                  color="#FFFFFF"
                  fontSize="0.75rem"
                  size="sm"
                >
                  가능
                </Button>
                <Button
                  borderRadius="0 0.25rem 0.25rem 0"
                  padding="0 1.5rem"
                  fontSize="0.75rem"
                  size="sm"
                >
                  불가
                </Button>
              </Flex>
            </Flex>
          </Flex>

          <Flex direction="column" padding="1.5rem 0" gap="1rem">
            <Heading fontSize="1rem" fontWeight="semibold">
              커스텀 설정
            </Heading>
            <Flex direction="column" gap="0.5rem">
              <Flex justify="space-between" align="center">
                <Text fontSize="0.875rem">옵션 1</Text>
                <Flex>
                  <Button
                    borderRadius="0.25rem 0 0 0.25rem"
                    padding="0 1.5rem"
                    background="#4E95FF"
                    color="#FFFFFF"
                    fontSize="0.75rem"
                    size="sm"
                  >
                    가능
                  </Button>
                  <Button
                    borderRadius="0 0.25rem 0.25rem 0"
                    padding="0 1.5rem"
                    fontSize="0.75rem"
                    size="sm"
                  >
                    불가
                  </Button>
                </Flex>
              </Flex>
              <Input />
            </Flex>
            <Flex direction="column" gap="0.5rem">
              <Flex justify="space-between" align="center">
                <Text fontSize="0.875rem">옵션 2</Text>
                <Flex>
                  <Button
                    borderRadius="0.25rem 0 0 0.25rem"
                    padding="0 1.5rem"
                    background="#4E95FF"
                    color="#FFFFFF"
                    fontSize="0.75rem"
                    size="sm"
                  >
                    가능
                  </Button>
                  <Button
                    borderRadius="0 0.25rem 0.25rem 0"
                    padding="0 1.5rem"
                    fontSize="0.75rem"
                    size="sm"
                  >
                    불가
                  </Button>
                </Flex>
              </Flex>
              <Input />
            </Flex>
            <Flex direction="column" gap="0.5rem">
              <Flex justify="space-between" align="center">
                <Text fontSize="0.875rem">옵션 3</Text>
                <Flex>
                  <Button
                    borderRadius="0.25rem 0 0 0.25rem"
                    padding="0 1.5rem"
                    background="#4E95FF"
                    color="#FFFFFF"
                    fontSize="0.75rem"
                    size="sm"
                  >
                    가능
                  </Button>
                  <Button
                    borderRadius="0 0.25rem 0.25rem 0"
                    padding="0 1.5rem"
                    fontSize="0.75rem"
                    size="sm"
                  >
                    불가
                  </Button>
                </Flex>
              </Flex>
              <Input />
            </Flex>
          </Flex>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminStoreManageContainer;
