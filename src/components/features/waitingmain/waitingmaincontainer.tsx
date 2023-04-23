import React, { useState, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
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
import { useMetaTag, useTitle } from "../../../utils/customhook";
import ErrorPageContainer from "../errorpage/errorpagecontainer";
import CommonLoadingModal from "../../common/commonloadingmodal";

const WaitingMainContainer: React.FC = () => {
  const { storeuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toastMsg = useToast();
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const [telInput, setTelInput] = useState("");
  const [inputCheck, setInputCheck] = useState(false);
  const [pageError, setPageError] = useState(false);

  const db = getFirestore();
  const waitingCol = query(collection(db, `storeList/${storeuid}/waitingList`));

  useLayoutEffect(() => {
    getDocs(waitingCol)
      .then((data) => {
        const list: any = [];
        data.forEach((doc) => {
          const userData = doc.data();
          list.push([userData, doc.id]);
          return list;
        });
        return list;
      })
      .then((list) => {
        const nowDate = new Date().getDate();
        list.forEach((document: any) => {
          const dataDate = new Date(document[0].createdAt!).getDate();
          if (nowDate !== dataDate) {
            deleteDoc(
              doc(db, `storeList/${storeuid}/waitingList`, document[1])
            );
          }
        });
      });
  }, []);

  // 현재 대기열 가져오기
  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      const nowDate = new Date().getDate();
      data.forEach((doc) => {
        if (doc.data().isentered === false) {
          const dataDate = new Date(doc.data().createdAt!).getDate();
          if (nowDate === dataDate) {
            list.push(doc.data());
          }
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
    onError(error) {
      setPageError(true);
    },
  });

  useTitle(
    storeOption.data?.storeName !== undefined
      ? `${storeOption.data?.storeName} ::: 웨잇세컨드`
      : "맛집을 기다릴 땐, 웨잇세컨드!"
  );

  useMetaTag({ title: `${storeOption.data?.storeName} ::: 웨잇세컨드` });

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

    navigate(`${location.pathname}/waitingstate/${telInput}`);
  };

  if (pageError === true) {
    return (
      <Box padding="4rem 0" height="100vh">
        <ErrorPageContainer />
      </Box>
    );
  }
  if (storeOption.data === undefined) {
    return <CommonLoadingModal />;
  } else {
    return (
      <section>
        <Box display="flex" height="13rem" marginTop="3.5rem" overflow="hidden">
          <Image
            src={storeOption.data?.storebg}
            objectFit="cover"
            height="100%"
            width="100%"
            loading="lazy"
          />
        </Box>
        <Flex
          as="article"
          direction="column"
          background="#ffffff"
          padding="1rem"
          border="none"
          top="-4rem"
          wordBreak="keep-all"
        >
          <Heading
            as="h1"
            textAlign="center"
            letterSpacing="-0.05rem"
            padding="1rem 0"
          >
            {storeOption.data === undefined ? "" : storeOption.data.storeName}
          </Heading>

          <Flex
            direction="row"
            justify="space-between"
            align="center"
            fontSize={visionState ? "1.625rem" : "1.5rem"}
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
          {storeOption.data?.waitingState ? (
            storeOption.data!.maximumWaitingTeamCount <=
            waitingList.data.length ? (
              <CommonFullBox data={waitingList.data} />
            ) : (
              <Flex direction="column" fontSize="1rem" margin="1rem 0">
                <Text
                  fontSize={visionState ? "1.625rem" : "1rem"}
                  color="mainBlue"
                >
                  대기 등록을 원하시면
                </Text>
                <Link
                  as={ReactRouterLink}
                  to={`${location.pathname}/waitingform`}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  background="mainBlue"
                  fontWeight="semibold"
                  fontSize={visionState ? "1.625rem" : "1.5rem"}
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
            )
          ) : (
            <CommonCloseBox />
          )}
          <Flex direction="column" fontSize="1rem" margin="1rem 0">
            <Text fontSize={visionState ? "1.625rem" : "1rem"} color="mainBlue">
              이미 대기 등록을 하셨다면
            </Text>
            <form onSubmit={moveToWaitingStatePage}>
              <Flex direction="column" margin="0.5rem 0 0.5rem 0">
                <CommonInput
                  id="tel"
                  title="등록하신 연락처"
                  type="tel"
                  value={telInput}
                  onChange={inputUserTelNumber}
                  margin="0.25rem 0"
                  placeholder="'-' 빼고 입력해주세요."
                  fontSize={visionState ? "1.625rem" : "1rem"}
                  holderSize={visionState ? "1.625rem" : "0.75rem"}
                />
                <CommonErrorMsg
                  type="tel"
                  value1={telInput}
                  inputCheck={{ tel: inputCheck }}
                  fontSize={visionState ? "1.625rem" : "0.75rem"}
                />
              </Flex>
              <Button
                type="submit"
                background="mainBlue"
                fontWeight="semibold"
                fontSize={visionState ? "1.625rem" : "1.5rem"}
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
        </Flex>
      </section>
    );
  }
};

export default WaitingMainContainer;
