import React, { Dispatch, SetStateAction } from "react";
import { UserData } from "../../../utils/typealies";
import {
  Box,
  Flex,
  FormLabel,
  Heading,
  Text,
  Button,
  ListItem,
  ListIcon,
  UnorderedList,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const CheckDataModal: React.FC<{
  userInfo: UserData;
  close: Dispatch<SetStateAction<boolean>>;
}> = ({ userInfo, close }) => {
  return (
    <Box
      background="rgba(38, 38, 38, 40%)"
      display="block"
      width="100vw"
      height="100vh"
      position="fixed"
      top="0"
      zIndex="5"
    >
      <Flex
        direction="column"
        background="#ffffff"
        margin="10vh 1rem"
        padding="3rem 1.5rem"
        justify="center"
        borderRadius="0.5rem"
      >
        <Heading
          as="h2"
          fontSize="1.25rem"
          textAlign="center"
          marginBottom="1.5rem"
        >
          작성 내용을 확인해주세요.
        </Heading>
        <Flex direction="column">
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            margin="0.5rem 0"
          >
            <FormLabel
              fontSize="1.25rem"
              fontWeight="500"
              width="30%"
              margin="0"
            >
              성함
            </FormLabel>
            <Text fontSize="1.25rem" color="#58a6dc" fontWeight="600">
              {userInfo.name}
            </Text>
          </Flex>
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            margin="0.5rem 0"
          >
            <FormLabel
              fontSize="1.25rem"
              fontWeight="500"
              width="30%"
              margin="0"
            >
              연락처
            </FormLabel>
            <Text fontSize="1.25rem" color="#58a6dc" fontWeight="600">
              {" "}
              {userInfo.tel}
            </Text>
          </Flex>
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            margin="0.5rem 0"
          >
            <FormLabel
              fontSize="1.25rem"
              fontWeight="500"
              width="30%"
              margin="0"
            >
              인원
            </FormLabel>
            <Text fontSize="1.25rem" color="#58a6dc" fontWeight="600">
              {userInfo.member}명
            </Text>
          </Flex>
          {userInfo.pet === true || userInfo.child === true ? (
            <Flex direction="column" margin="0.5rem 0">
              <FormLabel
                fontSize="1.25rem"
                fontWeight="500"
                width="30%"
                margin="0"
              >
                옵션
              </FormLabel>
              <Flex direction="column">
                <UnorderedList>
                  {userInfo.child === true ? (
                    <ListItem
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      fontSize="1.25rem"
                      margin="1rem 0"
                    >
                      <ListIcon as={CheckCircleIcon} />
                      <Text color="#58a6dc" fontWeight="600">
                        아이
                      </Text>
                      가 있어요.
                    </ListItem>
                  ) : (
                    <></>
                  )}
                  {userInfo.pet === true ? (
                    <ListItem
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      fontSize="1.25rem"
                      margin="1rem 0"
                    >
                      <ListIcon as={CheckCircleIcon} />
                      <Text color="#58a6dc" fontWeight="600">
                        반려 동물
                      </Text>
                      이 있어요.
                    </ListItem>
                  ) : (
                    <></>
                  )}
                </UnorderedList>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}
        </Flex>
        <Flex direction="row" gap="1rem" margin="1rem 0 0 0" justify="center">
          <Button
            type="button"
            background="#58a6dc"
            color="#ffffff"
            padding="1.5rem"
            borderRadius="0.25rem"
            fontSize="1.25rem"
          >
            맞습니다
          </Button>
          <Button
            type="button"
            background="#5a5a5a"
            color="#ffffff"
            padding="1.5rem"
            borderRadius="0.25rem"
            onClick={() => close(false)}
            fontSize="1.25rem"
          >
            아니에요
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CheckDataModal;
