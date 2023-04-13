import { Heading, Text } from "@chakra-ui/react";

const CommonFullBox = (data: any) => {
  return (
    <>
      <Heading
        as="h2"
        fontSize="1.25rem"
        letterSpacing="-0.05rem"
        padding="1.5rem 0"
        textAlign="center"
      >
        대기 접수 불가 안내
      </Heading>
      <Text
        as="p"
        fontSize="1rem"
        textAlign="center"
        lineHeight="1.5rem"
        wordBreak="keep-all"
        whiteSpace="pre-wrap"
        padding="1rem 2rem"
      >
        현재 매장 내 대기팀이 최대치에 도달해 대기 접수가 불가능한 상황입니다.
        <br />
        <br />
        관련 사항은 매장 내 직원에게 문의해주시기 바랍니다.
      </Text>
    </>
  );
};

export default CommonFullBox;
