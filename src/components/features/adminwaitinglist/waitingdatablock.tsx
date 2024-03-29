import { CloseIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faPhone, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useState } from "react";
import { StoreOption, UserData } from "../../../utils/typealies";
import AdminRegisterModal from "./adminregistermodal";
import * as Sentry from "@sentry/react";

const WaitingDataBlock: React.FC<{
  admin: string;
  userData: UserData;
  background: string;
  storeOption: StoreOption;
  waitingSetting: string;
}> = ({ admin, userData, background, storeOption, waitingSetting }) => {
  const [openState, setOpenState] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toastMsg = useToast();

  // 등록된 손님 정보 지우기
  const db = getFirestore();
  const queryClient = useQueryClient();

  const chnageGuestEnterOption = async (userData: UserData) => {
    const changeWaitingState = await setDoc(
      doc(db, `storeList/${admin}/waitingList`, `${userData.uid}`),
      { ...userData, isentered: !userData.isentered }
    )
      .then((data) => {
        return "delete-success";
      })
      .catch((error) => {
        Sentry.captureException(error.message);
        return error.message;
      });
    return changeWaitingState;
  };

  const enteredMutation = useMutation(chnageGuestEnterOption, {
    onError: (error, variable) => {
      Sentry.captureException(error);
      setLoadingState(false);
      return !toastMsg.isActive("error-unknown")
        ? toastMsg({
            title: "알 수 없는 에러",
            id: "error-unknown",
            description:
              "현재 알 수 없는 문제가 발생해 절차가 진행되지 않았습니다. 잠시 후 다시 시도해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    },
    onSuccess: (data, variable, context) => {
      setLoadingState(false);
      if (data === "delete-success") {
        queryClient.invalidateQueries(["currentWaitingState", waitingSetting]);
      } else {
      }
    },
  });

  const changeEnteredGuestState = (e: React.MouseEvent, userData: UserData) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingState(true);
    enteredMutation.mutate(userData);
  };

  const createDataTime = new Date(userData.createdAt!);

  const userTel = useBreakpointValue({
    base: userData.tel.substring(userData.tel.length - 4, userData.tel.length),
    desktop: userData.tel.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3"),
  });

  return (
    <>
      <AdminRegisterModal
        isOpen={isOpen}
        onClose={onClose}
        modify={true}
        userTel={userData.tel}
      />
      <Flex
        direction="row"
        padding="0.5rem"
        justify="space-between"
        width="100%"
        backgroundColor={background}
        borderBottom="1px solid black"
        onClick={() => setOpenState(!openState)}
        cursor="pointer"
      >
        <Flex direction="column" gap="0.25rem">
          <Flex
            direction="row"
            align="center"
            gap="0.5rem"
            margin="0.5rem"
            fontSize={{ base: "1rem", desktop: "1.25rem" }}
            pointerEvents="none"
          >
            <Text fontWeight="bold">{userData.name}</Text> 님
            <Box height="1rem" width="2px" background="accentGray" />
            <Text
              fontWeight="bold"
              color={userData.nonexistent ? "errorRed" : "#333333"}
            >
              {userTel}
            </Text>
          </Flex>
          <Flex
            direction="row"
            gap="0.5rem"
            alignItems="center"
            fontSize={{ base: "0.75rem", desktop: "1rem" }}
            margin="0.25rem 0.5rem"
            pointerEvents="none"
          >
            <Flex direction="row" gap="0.25rem">
              성인 <Text fontWeight="bold">{userData.adult}명</Text>
            </Flex>
            <Flex direction="row" gap="0.25rem">
              유아 <Text fontWeight="bold">{userData.child}명</Text>
            </Flex>
            {!userData.pet &&
            !userData.separate &&
            !userData.custom1 &&
            !userData.custom2 &&
            !userData.custom3 ? (
              <> </>
            ) : (
              <>
                {" "}
                <Box height="0.75rem  " width="2px" background="accentGray" />
                <Text color="mainBlue">
                  옵션 <TriangleDownIcon />
                </Text>
              </>
            )}
          </Flex>
        </Flex>
        <Flex direction="row" align="center" gap="1rem" margin="0 0.5rem">
          {userData.isentered || userData.nonexistent ? (
            <></>
          ) : (
            <Link
              href={`tel:${userData.tel}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                display="flex"
                flexDirection="column"
                width={{ base: "3rem", desktop: "3.75rem" }}
                height={{ base: "3rem", desktop: "3.75rem" }}
                backgroundColor="green"
                fontSize={{ base: "0.625rem", desktop: "0.825rem" }}
                color="#ffffff"
                fontWeight="normal"
                gap="0.375rem"
              >
                <FontAwesomeIcon icon={faPhone} fontSize="1rem" />
                전화
              </Button>
            </Link>
          )}

          <Button
            display="flex"
            flexDirection="column"
            width={{ base: "3rem", desktop: "3.75rem" }}
            height={{ base: "3rem", desktop: "3.75rem" }}
            backgroundColor={userData.isentered ? "errorRed" : "mainBlue"}
            fontSize={{ base: "0.625rem", desktop: "0.825rem" }}
            color="#ffffff"
            fontWeight="normal"
            gap={userData.isentered ? "0.5rem" : "0.25rem"}
            onClick={(e) => changeEnteredGuestState(e, userData)}
            isLoading={loadingState}
          >
            {userData.isentered ? (
              <>
                <CloseIcon fontSize="1rem" />
                완료 취소
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCircleCheck} fontSize="1.25rem" />
                입장 완료
              </>
            )}
          </Button>
        </Flex>
      </Flex>

      {openState ? (
        <Flex
          backgroundColor="#5A5A5A"
          width="100%"
          justifyContent="space-between"
          padding="1rem"
        >
          <Flex
            direction="column"
            justify="flex-start"
            fontSize={{ base: "0.75rem", desktop: "1rem" }}
            gap="0.5rem"
          >
            <Text color="#ffffff" marginBottom="0.25rem">
              대기 등록 시간:{" "}
              {`${createDataTime.getFullYear()}년 ${createDataTime.getMonth()}월 ${createDataTime.getDate()}일 ${createDataTime.getHours()}시 ${createDataTime.getMinutes()}분`}
            </Text>
            {!userData.pet &&
            !userData.separate &&
            !userData.custom1 &&
            !userData.custom2 &&
            !userData.custom3 ? (
              <></>
            ) : (
              <>
                <Text color="#ffffff">옵션 사항</Text>
                {userData.pet ? (
                  <Text color="subBlue">반려 동물이 있어요.</Text>
                ) : (
                  <></>
                )}
                {userData.separate ? (
                  <Text color="subBlue">자리가 나면 따로 앉아도 괜찮아요.</Text>
                ) : (
                  <></>
                )}
                {userData.custom1 ? (
                  <Text color="subBlue">{storeOption.customOption1Name}</Text>
                ) : (
                  <></>
                )}
                {userData.custom2 ? (
                  <Text color="subBlue">{storeOption.customOption2Name}</Text>
                ) : (
                  <></>
                )}
                {userData.custom3 ? (
                  <Text color="subBlue">{storeOption.customOption3Name}</Text>
                ) : (
                  <></>
                )}
              </>
            )}
          </Flex>
          <Button
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={{ base: "3rem", desktop: "3.75rem" }}
            height={{ base: "3rem", desktop: "3.75rem" }}
            backgroundColor="#FFFFFF"
            fontSize={{ base: "0.625rem", desktop: "0.825rem" }}
            fontWeight="normal"
            gap="0.25rem"
            onClick={onOpen}
          >
            <FontAwesomeIcon icon={faUserPen} fontSize="1.25rem" />
            정보 수정
          </Button>
        </Flex>
      ) : (
        <></>
      )}
    </>
  );
};

export default WaitingDataBlock;
