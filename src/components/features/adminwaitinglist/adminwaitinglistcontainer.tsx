import React, { useEffect, useState } from "react";
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import { UserData } from "../../../utils/typealies";
import WaitingDataBlock from "./waitingdatablock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import {
  loginStateCheck,
  tokenExpirationCheck,
} from "../../../utils/verifiedcheck";
import { useNavigate } from "react-router-dom";

const AdminWaitingListContainer = () => {
  const db = getFirestore();
  const queryClient = useQueryClient();
  const toastMsg = useToast();
  const navigate = useNavigate();

  const [waitingSetting, setWaitingSetting] = useState("entering");
  const [listState, setlistState] = useState(false);
  const [receiveState, setReceiveState] = useState(false);

  // 토큰이 만료됐는지 확인
  const expiredCheck = async () => {
    const expiredstate = await tokenExpirationCheck();
    return expiredstate;
  };

  useQuery({
    queryKey: ["tokenExpriedCheck"],
    queryFn: expiredCheck,
    onSuccess(data) {
      if (data === true) {
        if (!toastMsg.isActive("error-tokenExpired")) {
          return !toastMsg.isActive("error-tokenExpired")
            ? toastMsg({
                title: "계정 로그인 만료",
                id: "error-tokenExpired",
                description:
                  "오랫동안 페이지 내 활동이 없어 안전을 위해 로그인을 해제합니다. 다시 로그인해주세요.",
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            : null;
        }
        navigate("/adminlogin");
      }
    },
    onSettled(data, error) {
      setlistState(false);
    },
  });

  // 현재 가게 대기 정보 가져오기
  const waitingCol = query(
    collection(db, `storeList/${loginStateCheck()}/waitingList`)
  );

  useEffect(() => {
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
              doc(db, `storeList/${loginStateCheck()}/waitingList`, document[1])
            );
          }
        });
      });
  }, []);

  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      data.forEach((doc) => {
        if (waitingSetting === "entered") {
          if (doc.data().isentered === true) {
            const userData = doc.data();
            list.push({ ...userData, uid: doc.id });
          }
        } else if (waitingSetting === "entering") {
          if (doc.data().isentered === false) {
            const userData = doc.data();
            list.push({ ...userData, uid: doc.id });
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

  const { data } = useQuery({
    queryKey: ["currentWaitingState", waitingSetting],
    queryFn: getWaitingData,
    onSuccess(data) {},
    onSettled(data, error) {
      setlistState(false);
    },
  });

  // 관리자가 설정한 매장 관리 정보 가져오기
  const getStoreOption = async () => {
    const storeDataState = await getDocs(collection(db, "adminList")).then(
      (data) => {
        let adminData: any;
        data.forEach((doc) => {
          if (doc.data().uid === loginStateCheck()) {
            adminData = { data: doc.data(), uid: doc.id };
          }
        });
        return adminData;
      }
    );
    return storeDataState;
  };

  const storeOption = useQuery({
    queryKey: ["currentStoreOption"],
    queryFn: getStoreOption,
  });

  // 관리자 대기 접수 개시 및 마감 처리
  const changeWaitingReceiveSetting = async (currentState: boolean) => {
    const currentStoreOption = storeOption.data?.data;
    const updateDataState = await setDoc(
      doc(db, "adminList", `${storeOption.data?.uid}`),
      { ...currentStoreOption, waitingState: currentState }
    )
      .then((data) => "change-setting-success")
      .catch((error) => error.message);
    return updateDataState;
  };

  const receiveMutation = useMutation(changeWaitingReceiveSetting, {
    onError: (error, variable) => setReceiveState(false),
    onSuccess: (data) => {
      if (data === "change-setting-success") {
        setReceiveState(false);
        queryClient.invalidateQueries(["currentStoreOption"]);
      }
    },
  });

  const changeReceiveState = (e: React.MouseEvent) => {
    e.preventDefault();
    setReceiveState(true);
    receiveMutation.mutate(!storeOption.data?.data.waitingState);
  };

  // 목록 바꾸기
  const changeWaitingList = (e: React.MouseEvent) => {
    e.preventDefault();
    setlistState(true);
    if (waitingSetting === "entered") {
      setWaitingSetting("entering");
    } else if (waitingSetting === "entering") {
      setWaitingSetting("entered");
    }
  };

  return (
    <>
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        fontSize="1.5rem"
        padding="1rem"
        position="fixed"
        zIndex="3"
        backgroundColor="#ffffff"
        width="100%"
        top="3.5rem"
        borderBottom="1px solid black"
      >
        <Text letterSpacing="-0.1rem">
          {waitingSetting === "entering" ? "현재 대기팀" : "입장 완료팀"}
        </Text>
        <Text fontWeight="bold" color="#58a6dc">
          {data === undefined
            ? "확인 중"
            : data.length === 0
            ? "없음"
            : `${data.length} 팀`}
        </Text>
      </Flex>
      <Flex
        as="article"
        direction="column"
        background="#F2F2F2"
        minHeight="75vh"
        margin="2.25rem 0 0.5rem 0"
      >
        <Flex direction="column" align="center" fontSize="1.25rem">
          {data?.map((elem: UserData, index: number) => {
            return (
              <WaitingDataBlock
                key={index}
                userData={elem}
                admin={loginStateCheck()}
                storeOption={storeOption.data?.data}
                background={index % 2 === 0 ? "#FFFFFF" : "#F4F4F4"}
                waitingSetting={waitingSetting}
              />
            );
          })}
        </Flex>
      </Flex>
      <Flex
        direction="row"
        background="#FFFFFF"
        position="fixed"
        bottom="0"
        width="100%"
        justifyContent="space-evenly"
        height="3.5rem"
        borderTop="1px Solid #424242"
      >
        <Button
          color={storeOption.data?.data.waitingState ? "errorRed" : "mainBlue"}
          background="none"
          borderRadius="0"
          display="flex"
          flexDirection="column"
          size="lg"
          height="100%"
          width="100%"
          margin="0 0.5rem"
          padding="0.5rem 0"
          fontSize="1rem"
          gap="0.25rem"
          onClick={changeReceiveState}
          isLoading={receiveState}
        >
          {storeOption.data?.data.waitingState ? (
            <>
              <FontAwesomeIcon icon={faStop} /> 접수 마감
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlay} />
              접수 개시
            </>
          )}
        </Button>
        <Button
          background="none"
          borderRadius="0"
          display="flex"
          flexDirection="column"
          size="lg"
          height="100%"
          width="100%"
          margin="0 0.5rem"
          padding="0.5rem 0"
          fontSize="1rem"
          gap="0.25rem"
          onClick={changeWaitingList}
          isLoading={listState}
        >
          <FontAwesomeIcon icon={faList} />
          {waitingSetting === "entering" ? "대기중 리스트" : "입장 완료 리스트"}
        </Button>
      </Flex>
    </>
  );
};

export default AdminWaitingListContainer;
