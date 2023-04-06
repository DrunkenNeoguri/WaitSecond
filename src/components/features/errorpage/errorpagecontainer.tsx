import { WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPageContainer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box as="article" padding="2rem 0" wordBreak="keep-all">
      <Flex
        direction="column"
        align="center"
        background="#ffffff"
        padding="3rem 1.5rem 2rem 1.5rem"
        margin="0 1rem"
        borderRadius="1rem"
        boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        textAlign="center"
      >
        <WarningTwoIcon color="errorRed" boxSize="10" />
        <Heading as="h2" fontSize="1.25rem" padding="2rem 0 1rem 0">
          요청하신 페이지를
          <br />
          찾을 수 없습니다.
        </Heading>
        <Text
          fontSize="1rem"
          lineHeight="1.5rem"
          letterSpacing="-1px"
          margin="1rem 0"
          gap="1rem"
        >
          입력하신 페이지의 주소가 잘못되었거나,
          <br />
          사용이 일시 중단되어 요청하신
          <br />
          페이지를 찾을 수 없습니다.
          <br />
          <br />
          서비스 이용에 불편을 드려 죄송합니다.
        </Text>
        <Button
          type="submit"
          variant="solid"
          background="mainBlue"
          padding="0.5rem auto"
          fontSize="1.25rem"
          borderRadius="0.25rem"
          color="#ffffff"
          width="100%"
          height="3rem"
          margin="1.5rem 0 1rem 0"
          onClick={() => navigate(-1)}
        >
          이전 페이지로 이동
        </Button>
      </Flex>
    </Box>
  );
};

export default ErrorPageContainer;
