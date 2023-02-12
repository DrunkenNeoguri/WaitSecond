import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  ListIcon,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { lowVisionState } from "../../../modules/atoms/atoms";

const WaitingStateContainer = () => {
  const visionState = useRecoilValue<boolean>(lowVisionState);

  const db = getFirestore();
  const waitingCol = collection(db, "testData");

  function getWaitingData() {
    return getDocs(waitingCol).then((data) => {
      const list: any = [];
      data.forEach((doc) => {
        list.push(doc.data());
      });
      return list;
    });
  }

  const waitingList = useQuery({
    queryKey: ["waitingList"],
    queryFn: () => getWaitingData(),
  });

  console.log(waitingList.data);

  return (
    <section style={{ background: "#EDEDED", padding: "1rem 0" }}>
      <Flex
        as="article"
        direction="column"
        background="#ffffff"
        padding="3rem 1rem"
        margin="5rem 1rem 0 1rem"
        border="none"
        borderRadius="1rem"
        boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
      >
        <Heading as="h1" textAlign="center">
          너굴 상점
        </Heading>
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          margin="1.5rem 0"
        >
          <Text fontWeight="600">현재 대기 팀</Text>
          <Text fontSize="1.75rem" fontWeight="700" color="#58a6dc">
            {waitingList.data.length}팀
          </Text>
        </Flex>

        <Text
          borderRadius="0.25rem"
          fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          letterSpacing="-2%"
          lineHeight={visionState === false ? "2rem" : "2.25rem"}
          margin="0.25rem 0"
          whiteSpace="pre-wrap"
          textAlign="left"
          color="#4E95FF"
        >
          순서가 가까워졌어요.
          <br />
          가게 근처에서 기다려주세요.
        </Text>
        <Box
          display="block"
          background="#d4d4d4"
          height="0.125rem"
          borderRadius="1rem"
          boxSizing="border-box"
          margin="2rem 1rem"
        />
        <Heading
          as="h2"
          fontWeight="600"
          fontSize={visionState === false ? "1.5rem" : "1.625rem"}
        >
          내 정보
        </Heading>
        <Flex direction="column">
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            margin="1.5rem 0"
          >
            <Text fontWeight="600">인원</Text>
            <Text fontSize="1.75rem" fontWeight="700" color="#58a6dc">
              {waitingList.data[0].member}명
            </Text>
          </Flex>
        </Flex>
        <Text
          fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          fontWeight="600"
        >
          추가 옵션
        </Text>
        <UnorderedList
          fontSize={visionState === false ? "1.25rem" : "1.625rem"}
        >
          {waitingList.data[0].child === true ? (
            <ListItem
              display="flex"
              flexDirection="row"
              alignItems="center"
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
          {waitingList.data[0].pet === true ? (
            <ListItem
              display="flex"
              flexDirection="row"
              alignItems="center"
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
        <Flex
          direction={visionState === false ? "row" : "column"}
          justify="space-between"
          align={visionState === false ? "center" : "flex-start"}
          fontSize={visionState === false ? "1rem" : "1.625rem"}
          margin="1rem 0 2rem 0"
          color="#8F8F8F"
        >
          <Text>대기 시작 시간</Text>
          <Text>2021-01-30 11:59</Text>
        </Flex>
        <Button
          type="button"
          background="#5a5a5a"
          color="#ffffff"
          borderRadius="0.25rem"
          fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          fontWeight="500"
          size="lg"
        >
          대기 등록 취소
        </Button>
      </Flex>
    </section>
  );
};

export default WaitingStateContainer;
