import { Flex } from "@chakra-ui/react";

const CommonBlankBox: React.FC<{
  waitingSetting: string;
}> = ({ waitingSetting }) => {
  return (
    <Flex
      background="#F2F2F2"
      justify="center"
      align="center"
      margin="5rem 0"
      width="100%"
      wordBreak="keep-all"
      fontSize="1.25rem"
    >
      {waitingSetting === "entering"
        ? "현재 대기 중인 고객이 없습니다."
        : "현재 입장한 고객이 없습니다."}
    </Flex>
  );
};

export default CommonBlankBox;
