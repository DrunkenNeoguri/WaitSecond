import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { lowVisionState } from "../../../modules/atoms/atoms";
import { useRecoilValue } from "recoil";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const CheckDataModal: React.FC<{
  userInfo: UserData;
  close: Dispatch<SetStateAction<boolean>>;
}> = ({ userInfo, close }) => {
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const [registerState, setRegisterState] = useState(false);

  const [time, setTime] = useState(3);
  const timeRef = useRef(time);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { store } = useParams();

  const db = getFirestore();

  useEffect(() => {
    // setInterval 속에서 useState를 사용하는 경우, state의 값이 변경되지 않고 초기값을 유지하게 됨을 알 수 있다.
    // 데이터가 갱신되지만, useEffect 안의 내용은 의존성 배열에 포함되지 않는다면 변화되지 않기 때문이다.
    // 이때를 위해서 변화된 값을 참고하게 만들기 위해 useRef를 사용하도록 한다.

    const timer = setInterval(() => {
      setTime((timeRef.current -= 1));
      // 위와 같이 작성해두면, timeRef의 현재값이 계속해서 setState를 통해서 적용될 것이다.
      // 렌더링이 일어나도, timeRef가 계속해서 현재의 값을 참조하게 되므로 useEffect 속에 변화된 값을 받아올 수 있게 된다.
      if (timeRef.current < 1) {
        clearInterval(timer);
        setRegisterState(false);
        close(false);
        navigate(`/${store}/waitingstate/${userInfo.tel}`);

        // 해당 내용에서 react-router를 통한 페이지 이동 구현할 것.
        // 버튼 쪽에도 함수 넣을 것.
        // https://bsnn.tistory.com/50
      }
    }, 1000);
    // }
  }, []);

  const sendWaitingDataToDatabase = async (userInfo: UserData) => {
    const sendUserData = {
      ...userInfo,
      createdAt: new Date().getTime(),
    };
    const addWaitingData = await setDoc(
      doc(db, `${store}`, userInfo.tel),
      sendUserData
    )
      .then((data) => data)
      .catch((error) => error.message);
    return addWaitingData;
  };

  const waitingMutation = useMutation(sendWaitingDataToDatabase, {
    onError: (error, variable) => console.log(error, variable),
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries(["waitingList"]);
      setRegisterState(true);
    },
  });

  const submitUserWaitingData = (e: React.MouseEvent, userData: UserData) => {
    e.preventDefault();
    waitingMutation.mutate(userData);
  };

  return (
    <Box
      background="rgba(38, 38, 38, 40%)"
      display="block"
      width="100vw"
      height="100vh"
      position="fixed"
      top="0"
      zIndex="5"
      overflow="scroll"
    >
      {registerState === true ? (
        <Flex
          direction="column"
          background="#ffffff"
          margin="10vh 1rem"
          padding="3rem 1.5rem"
          justify="center"
          borderRadius="0.5rem"
        >
          <Heading as="h1" textAlign="center" fontSize="2rem">
            등록이 완료되었습니다!
          </Heading>
          <Text
            textAlign="center"
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          >
            5초 뒤에 자동으로 대기 상황 페이지로 이동합니다.
          </Text>
          <Button
            type="button"
            background="#5a5a5a"
            color="#ffffff"
            padding="1.5rem"
            borderRadius="0.25rem"
            onClick={() => {
              close(false);
              setRegisterState(false);
              navigate(`/asgs/waitingstate/${userInfo.tel}`);
            }}
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          >
            바로 이동하기 ({time})
          </Button>
        </Flex>
      ) : (
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
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            textAlign="center"
            marginBottom="1.5rem"
          >
            작성 내용을{visionState === false ? " " : <br />}확인해주세요.
          </Heading>
          <Flex direction="column">
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <FormLabel
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                성함
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                color="#58a6dc"
                fontWeight="600"
              >
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
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                연락처
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                color="#58a6dc"
                fontWeight="600"
              >
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
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                인원
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                color="#58a6dc"
                fontWeight="600"
              >
                {userInfo.member}명
              </Text>
            </Flex>
            {userInfo.pet === true || userInfo.child === true ? (
              <Flex direction="column" margin="0.5rem 0">
                <FormLabel
                  fontSize={visionState === false ? "1.25rem" : "1.625rem"}
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
                        fontSize={
                          visionState === false ? "1.25rem" : "1.625rem"
                        }
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
                        fontSize={
                          visionState === false ? "1.25rem" : "1.625rem"
                        }
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
              fontSize={visionState === false ? "1.25rem" : "1.625rem"}
              onClick={(e) => submitUserWaitingData(e, userInfo)}
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
              fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            >
              아니에요
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default CheckDataModal;
