import { CloseIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Link, Text, useDisclosure } from "@chakra-ui/react";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faPhone, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useState } from "react";
import { StoreOption, UserData } from "../../../utils/typealies";
import AdminRegisterModal from "./adminregistermodal";

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
      .catch((error) => console.log(error.message));
    return changeWaitingState;
  };

  const enteredMutation = useMutation(chnageGuestEnterOption, {
    onError: (error, variable) => console.log(error),
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

  return (
    <>
      <AdminRegisterModal
        isOpen={isOpen}
        onClose={onClose}
        modify={true}
        modifyData={userData}
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
            fontSize="1rem"
            pointerEvents="none"
          >
            <Text fontWeight="bold">{userData.name}</Text> 님
            <Box height="1rem" width="2px" background="accentGray" />
            <Text fontWeight="bold" fontSize="1rem">
              {userData.tel.substring(
                userData.tel.length - 4,
                userData.tel.length
              )}
            </Text>
          </Flex>
          <Flex
            direction="row"
            gap="0.5rem"
            alignItems="center"
            fontSize="0.75rem"
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
          {userData.isentered ? (
            <></>
          ) : (
            <Link
              href={`tel:${userData.tel}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                display="flex"
                flexDirection="column"
                width="3rem"
                height="3rem"
                backgroundColor="green"
                fontSize="0.625rem"
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
            width="3rem"
            height="3rem"
            backgroundColor={userData.isentered ? "errorRed" : "mainBlue"}
            fontSize="0.625rem"
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
            fontSize="0.75rem"
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
            width="3rem"
            height="3rem"
            backgroundColor="#FFFFFF"
            fontSize="0.625rem"
            color="#333333"
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
