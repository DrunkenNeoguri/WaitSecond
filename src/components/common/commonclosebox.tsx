import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { lowVisionState } from "../../modules/atoms/atoms";

const CommonCloseBox: React.FC<{}> = () => {
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const { storeuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Flex direction="column" padding="1rem 0" gap="1rem" wordBreak="keep-all">
        <Heading
          as="h2"
          fontSize={visionState ? "1.625rem" : "1.25rem"}
          letterSpacing="-0.05rem"
          textAlign="center"
        >
          대기 접수 마감 안내
        </Heading>
        <Text
          as="p"
          fontSize={visionState ? "1.625rem" : "1rem"}
          textAlign="center"
          lineHeight={visionState ? "2.25rem" : "1.5rem"}
        >
          금일 대기 접수는 마감되었습니다.
        </Text>
      </Flex>
      {location.pathname === `/store/${storeuid}/waitingform` ? (
        <Button
          type="button"
          background="mainBlue"
          fontSize={visionState === false ? "1.5rem" : "1.625rem"}
          color="#FFFFFF"
          padding="0.5rem auto"
          margin="2rem 0"
          borderRadius="0.25rem"
          height="3rem"
          width="100%"
          onClick={() => navigate(`/store/${storeuid}`)}
        >
          이전 페이지로 이동
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

export default CommonCloseBox;
