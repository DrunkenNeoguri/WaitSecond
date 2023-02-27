import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EventObject, UserData } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";
import {
  faMinus,
  faPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { telRegex } from "../../../utils/reqlist";
import CheckDataModal from "./checkdatamodal";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Text,
} from "@chakra-ui/react";
import { lowVisionState } from "../../../modules/atoms/atoms";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";

const WaitingFormContainer: React.FC = () => {
  const initialState = new UserData("", "", 1, false, false);

  const [userData, setUserData] = useState<UserData>(initialState);
  const [agreeState, setAgreeState] = useState(false);
  const [modalState, setModalState] = useState(false);
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const { store } = useParams();

  const db = getFirestore();
  const waitingCol = collection(db, `${store}`);

  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      data.forEach((doc) => {
        list.push(doc.data());
      });
      list.sort(function (a: any, b: any) {
        return a.createdAt - b.createdAt;
      });
      return list;
    });
    return waitingState;
  };

  const waitingList = useQuery({
    queryKey: ["waitingList"],
    queryFn: getWaitingData,
  });

  // Func - Input User Data
  const inputUserText = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setUserData({ ...userData, [id]: value });
  };

  // Func - change state when user clicked checkbox
  const changeCheckState = (e: React.ChangeEvent, state: boolean) => {
    e.preventDefault();
    setUserData({ ...userData, [e.currentTarget.id]: !state });
  };

  // Func - change state when user clicked member count button
  const changeMemberCount = (e: React.MouseEvent) => {
    e.preventDefault();

    if (e.currentTarget.id === "countMinus" && userData.member > 1) {
      setUserData({ ...userData, member: userData.member - 1 });
    } else if (e.currentTarget.id === "countPlus") {
      setUserData({ ...userData, member: userData.member + 1 });
    }
  };

  // Func - change state when user clicked agree button
  const changeAgreeState = (e: React.ChangeEvent) => {
    e.preventDefault();
    setAgreeState(!agreeState);
  };

  // Func - send data when user submit the data
  const submitUserData = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreeState === false) {
      return alert("참고 사항을 읽어주시고 확인란에 체크해주세요.");
    }

    if (userData.name.trim() === "") {
      return alert("성함을 입력해주세요.");
    }

    if (userData.tel === "" || telRegex.test(userData.tel) === false) {
      return alert("연락처를 정확하게 작성해주세요.");
    }
    setModalState(true);
  };

  return (
    <section>
      <Box
        background="#58a6dc"
        display="block"
        height="13rem"
        marginTop="3.5rem"
      />
      {modalState === true ? (
        <CheckDataModal userInfo={userData} close={setModalState} />
      ) : (
        <></>
      )}
      <Flex
        as="article"
        direction="column"
        position="relative"
        background="#ffffff"
        padding="2rem 1rem"
        margin="0 1rem"
        border="none"
        borderRadius="1rem 1rem 0 0"
        top="-4rem"
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
          <Text>현재 대기 팀</Text>
          <Text fontSize="1.75rem" fontWeight="700" color="#58a6dc">
            {waitingList.data === undefined
              ? "확인 중"
              : waitingList.data === 0
              ? "없음"
              : `${waitingList.data.length} 팀`}
          </Text>
        </Flex>
        <form onSubmit={submitUserData}>
          <FormControl textAlign="center">
            <Flex direction="column">
              <Flex direction="row" align="center">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{
                    color: "red",
                    fontSize: visionState === false ? "1.5rem" : "1.625rem",
                  }}
                />
                <Text
                  margin="0 0.5rem"
                  fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                  color="#58a6dc"
                  fontWeight="600"
                >
                  참고해주세요!
                </Text>
              </Flex>
              <Text
                border="2px solid #4E95FF"
                borderRadius="0.25rem"
                fontSize={visionState === false ? "1rem" : "1.625rem"}
                letterSpacing="-2%"
                lineHeight={visionState === false ? "1.5rem" : "2.25rem"}
                margin="1.5rem 0"
                padding="0.25rem"
                whiteSpace="pre-wrap"
                textAlign="left"
              >
                대기 등록을 위해 성함과 연락처를 수집하고 있습니다.
                <br />
                수집한 정보는 가게에 입장하거나, 대기 취소 시 자동으로
                삭제됩니다.
              </Text>
              <Flex direction="row" align="center">
                <Checkbox
                  size="lg"
                  id="agree"
                  onChange={changeAgreeState}
                  isChecked={agreeState === false ? false : true}
                />
                <FormLabel
                  htmlFor="agree"
                  fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                  margin="0 0.5rem"
                  cursor="pointer"
                >
                  확인했습니다.
                </FormLabel>
              </Flex>
            </Flex>
            <Box
              display="block"
              background="#d4d4d4"
              height="0.125rem"
              borderRadius="1rem"
              boxSizing="border-box"
              margin="2rem 1rem"
            />
            <CommonInput
              id="name"
              type="text"
              title="성함"
              value={userData.name}
              onChange={inputUserText}
              fontSize={visionState === false ? "1.5rem" : "1.625rem"}
              labelWidth="30%"
              inputWidth="70%"
              margin="2rem 0"
            />
            <CommonInput
              id="tel"
              type="tel"
              title="연락처"
              value={userData.tel}
              onChange={inputUserText}
              fontSize={visionState === false ? "1.5rem" : "1.625rem"}
              labelWidth="30%"
              inputWidth="70%"
              margin="2rem 0"
            />
            <Flex
              direction="row"
              align="center"
              justify="space-between"
              margin="2rem 0"
            >
              <FormLabel
                fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                인원
              </FormLabel>
              <Flex
                width="70%"
                justifyContent="space-between"
                flex="1 0 2.5rem"
              >
                <Button
                  id="countMinus"
                  onClick={changeMemberCount}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="2.5rem"
                  flex="1 0 2.5rem"
                  margin="0 1rem 0 0"
                  background="#5ABFB7"
                  fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                  color="#FFFFFF"
                  padding={0}
                  borderRadius="4px"
                  border="1px solid gray"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <Flex
                  justify="center"
                  align="center"
                  height="2.5rem"
                  fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                  color="#000000"
                  padding="0.5rem 0"
                  borderRadius="4px"
                  border="1px solid gray"
                  width="100%"
                >
                  {userData.member}명
                </Flex>
                <Button
                  id="countPlus"
                  onClick={changeMemberCount}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="2.5rem"
                  flex="1 0 2.5rem"
                  margin="0 0 0 1rem"
                  background="#5ABFB7"
                  fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                  color="#FFFFFF"
                  padding={0}
                  borderRadius="4px"
                  border="1px solid gray"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Flex>
            </Flex>
            <Box>
              <Flex align="center" margin="1rem 0">
                <Checkbox
                  size="lg"
                  id="child"
                  onChange={(e: React.ChangeEvent) =>
                    changeCheckState(e, userData.child!)
                  }
                  isChecked={userData.child === false ? false : true}
                />
                <FormLabel
                  fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                  fontWeight="500"
                  width="auto"
                  margin="0 0.5rem"
                  htmlFor="child"
                  cursor="pointer"
                >
                  아이가 있어요.
                </FormLabel>
              </Flex>
              <Flex align="center" margin="1rem 0">
                <Checkbox
                  size="lg"
                  id="pet"
                  onChange={(e: React.ChangeEvent) =>
                    changeCheckState(e, userData.pet!)
                  }
                  isChecked={userData.pet === false ? false : true}
                />
                <FormLabel
                  fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                  fontWeight="500"
                  width="auto"
                  margin="0 0.5rem"
                  htmlFor="pet"
                  cursor="pointer"
                >
                  반려 동물이 있어요.
                </FormLabel>
              </Flex>
            </Box>
            <Button
              type="submit"
              variant="solid"
              background="#5ABFB7"
              padding="0.5rem auto"
              fontSize={visionState === false ? "1.5rem" : "1.625rem"}
              borderRadius="0.25rem"
              color="#ffffff"
              width="90%"
            >
              대기 등록
            </Button>
          </FormControl>
        </form>
      </Flex>
    </section>
  );
};

export default WaitingFormContainer;
