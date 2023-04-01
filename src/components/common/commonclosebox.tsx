import { Button, Heading, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { lowVisionState } from "../../modules/atoms/atoms";

const CommonCloseBox = () => {
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const { storeuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Heading
        as="h2"
        fontSize="1.25rem"
        letterSpacing="-0.05rem"
        padding="2rem 0"
        textAlign="center"
      >
        대기 접수 마감 안내
      </Heading>
      <Text as="p" fontSize="1rem" textAlign="center" lineHeight="1.5rem">
        현재 매장 내 대기 접수 마감된 상태입니다. <br />
        다음에 다시 이용해주십시오.
        <br />
        <br />
        감사합니다.
      </Text>
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
