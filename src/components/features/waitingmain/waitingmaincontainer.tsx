import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { lowVisionState } from "../../../modules/atoms/atoms";
import { EventObject, StoreOption, UserData } from "../../../utils/typealies";
import { Link as ReactRouterLink } from "react-router-dom";
import { CommonInput } from "../../common/commoninput";
import { telRegex } from "../../../utils/reqlist";
import CommonErrorMsg from "../../common/commonerrormsg";
import CommonCloseBox from "../../common/commonclosebox";
import CommonFullBox from "../../common/commonfullbox";

const WaitingMainContainer: React.FC = () => {
  const { storeuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toastMsg = useToast();
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const [telInput, setTelInput] = useState("");
  const [inputCheck, setInputCheck] = useState(false);

  const db = getFirestore();
  const waitingCol = query(collection(db, `storeList/${storeuid}/waitingList`));

  // 현재 대기열 가져오기
  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      data.forEach((doc) => {
        if (doc.data().isentered === false) {
          list.push(doc.data());
        }
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

  const inputUserTelNumber = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { value }: EventObject = e.currentTarget;
    setTelInput(value!);

    if (inputCheck === false) {
      setInputCheck(true);
    }
  };

  // 관리자가 설정한 매장 관리 정보 가져오기
  const getStoreOption = async () => {
    const storeDataState: StoreOption | undefined = await getDocs(
      collection(db, "adminList")
    ).then((data) => {
      let adminData: any;
      data.forEach((doc) => {
        if (doc.data().uid === storeuid) {
          return (adminData = doc.data());
        }
      });
      return adminData!;
    });
    return storeDataState;
  };

  const storeOption = useQuery({
    queryKey: ["storeOption"],
    queryFn: getStoreOption,
  });

  const moveToWaitingStatePage = (e: React.FormEvent) => {
    e.preventDefault();

    if (telInput === "" || telRegex.test(telInput) === false) {
      return !toastMsg.isActive("error-telCheck")
        ? toastMsg({
            title: "연락처 확인",
            id: "error-telCheck",
            description: "연락처를 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    if (
      waitingList.data.filter((elem: UserData) => elem.tel === telInput)
        .length === 0
    ) {
      return !toastMsg.isActive("error-notRegisterWaiting")
        ? toastMsg({
            title: "등록되지 않음",
            id: "error-notRegisterWaiting",
            description:
              "해당 연락처로 등록된 정보가 없습니다. 대기 등록을 진행해주시길 바랍니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    navigate(`/store/${location.pathname}/waitingstate/${telInput}`);
  };

  return (
    <section>
      <Box
        background="#58a6dc"
        display="block"
        height="13rem"
        marginTop="3.5rem"
      />
      <Flex
        as="article"
        direction="column"
        background="#ffffff"
        padding="1rem"
        border="none"
        top="-4rem"
      >
        <Heading
          as="h1"
          textAlign="center"
          letterSpacing="-0.05rem"
          padding="1rem 0"
        >
          {storeOption.data === undefined
            ? "불러오는중불러오는중불러오는중불러오는중"
            : storeOption.data.storeName}
        </Heading>
        {storeOption.data?.waitingState ? (
          storeOption.data.maximumWaitingTeamCount <=
          waitingList.data.length ? (
            <CommonFullBox data={waitingList.data} />
          ) : (
            <>
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                fontWeight="semibold"
                letterSpacing="-0.1rem"
                margin="0.5rem 0 1rem 0"
              >
                <Text>현재 대기팀</Text>
                <Text fontSize="1.75rem" fontWeight="700" color="mainBlue">
                  {waitingList.data === undefined
                    ? "확인 중"
                    : waitingList.data.length === 0
                    ? "없음"
                    : `${waitingList.data.length} 팀`}
                </Text>
              </Flex>
              <Flex direction="column" fontSize="1rem" margin="1rem 0">
                <Text>대기 등록을 원하시면</Text>
                <Link
                  as={ReactRouterLink}
                  to={`${location.pathname}/waitingform`}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  background="mainBlue"
                  fontWeight="semibold"
                  fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                  color="#FFFFFF"
                  padding="0.5rem auto"
                  margin="1rem 0"
                  borderRadius="0.25rem"
                  height="3rem"
                  width="100%"
                  _hover={{ textDecoration: "none", background: "#E2E8F0" }}
                >
                  대기 등록
                </Link>
              </Flex>
              <Flex direction="column" fontSize="1rem" margin="1rem 0">
                <Text>이미 대기 등록을 하셨다면</Text>
                <form onSubmit={moveToWaitingStatePage}>
                  <Flex direction="column" margin="0.5rem 0 0.5rem 0">
                    <CommonInput
                      id="tel"
                      title="등록하신 연락처"
                      type="tel"
                      value={telInput}
                      onChange={inputUserTelNumber}
                      margin="0.25rem 0"
                    />
                    <CommonErrorMsg
                      type="tel"
                      value1={telInput}
                      inputCheck={{ tel: inputCheck }}
                    />
                  </Flex>
                  <Button
                    type="submit"
                    background="mainBlue"
                    fontWeight="semibold"
                    fontSize={visionState === false ? "1.5rem" : "1.625rem"}
                    color="#FFFFFF"
                    padding="0.5rem auto"
                    margin="0.5rem 0"
                    borderRadius="0.25rem"
                    height="3rem"
                    width="100%"
                  >
                    대기 상태 확인
                  </Button>
                </form>
              </Flex>
            </>
          )
        ) : (
          <CommonCloseBox />
        )}
      </Flex>
    </section>
  );
};

export default WaitingMainContainer;
