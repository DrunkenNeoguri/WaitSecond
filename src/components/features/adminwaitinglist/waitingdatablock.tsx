import { TriangleDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { StoreOption, UserData } from "../../../utils/typealies";

const WaitingDataBlock: React.FC<{
  admin: string;
  userData: UserData;
  background: string;
  storeOption: StoreOption;
}> = ({ admin, userData, background, storeOption }) => {
  const [openState, setOpenState] = useState(false);

  // 등록된 손님 정보 지우기
  const db = getFirestore();
  const queryClient = useQueryClient();

  const deleteGuestData = async (userData: UserData) => {
    const deleteWaitingState = deleteDoc(
      doc(db, `storeList/${admin}/waitingList`, `${userData.uid}`)
    )
      .then((data) => "delete-success")
      .catch((error) => error.message);
    return deleteWaitingState;
  };

  const deleteMutation = useMutation(deleteGuestData, {
    onError: (error, variable) => console.log(error),
    onSuccess: (data, variable, context) => {
      if (data === "delete-success") {
        queryClient.invalidateQueries(["currentWaitingState"]);
      } else {
      }
    },
  });

  const deleteGuestDataByEntered = (
    e: React.MouseEvent,
    userData: UserData
  ) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutation.mutate(userData);
  };

  const createDataTime = new Date(userData.createdAt!);

  return (
    <>
      <Flex
        direction="row"
        padding="0.5rem"
        justify="space-between"
        width="100%"
        backgroundColor={background}
        borderTop="1px solid black"
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
            {!userData.pet ||
            !userData.custom1 ||
            !userData.custom2 ||
            !userData.custom3 ? (
              <>
                <Box height="0.75rem  " width="2px" background="accentGray" />
                <Text color="subBlue">
                  옵션 <TriangleDownIcon />
                </Text>
              </>
            ) : (
              <></>
            )}
          </Flex>
        </Flex>
        <Flex direction="row" align="center" gap="1rem" margin="0 0.5rem">
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
              <FontAwesomeIcon icon={faPhone} fontSize="1.125rem" />
              전화
            </Button>
          </Link>

          <Button
            display="flex"
            flexDirection="column"
            width="3rem"
            height="3rem"
            backgroundColor="#4E95FF"
            fontSize="0.625rem"
            color="#ffffff"
            fontWeight="normal"
            gap="0.25rem"
            onClick={(e) => deleteGuestDataByEntered(e, userData)}
          >
            <FontAwesomeIcon icon={faCircleCheck} fontSize="1.25rem" />
            입장 완료
          </Button>
        </Flex>
      </Flex>

      {openState ? (
        <Flex
          direction="column"
          padding="1rem"
          justify="flex-start"
          width="100%"
          fontSize="0.75rem"
          backgroundColor="#5A5A5A"
          gap="0.5rem"
        >
          <Text color="#ffffff" marginBottom="0.25rem">
            대기 등록 시간:{" "}
            {`${createDataTime.getFullYear()}년 ${createDataTime.getMonth()}월 ${createDataTime.getDate()}일 ${createDataTime.getHours()}시 ${createDataTime.getMinutes()}분`}
          </Text>
          <Text color="#ffffff">옵션 사항</Text>
          {userData.pet ? (
            <Text color="mainBlue">반려 동물이 있어요.</Text>
          ) : (
            <></>
          )}
          {userData.separate ? (
            <Text color="mainBlue">자리가 나면 따로 앉아도 괜찮아요.</Text>
          ) : (
            <></>
          )}
          {userData.custom1 ? (
            <Text color="mainBlue">{storeOption.customOption1Name}</Text>
          ) : (
            <></>
          )}
          {userData.custom2 ? (
            <Text color="mainBlue">{storeOption.customOption2Name}</Text>
          ) : (
            <></>
          )}
          {userData.custom3 ? (
            <Text color="mainBlue">{storeOption.customOption3Name}</Text>
          ) : (
            <></>
          )}
        </Flex>
      ) : (
        <></>
      )}
    </>
  );
};

export default WaitingDataBlock;
