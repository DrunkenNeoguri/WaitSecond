import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { UserData } from "../../../utils/typealies";

const WaitingDataBlock: React.FC<{ admin: string; userData: UserData }> = ({
  admin,
  userData,
}) => {
  const [openState, setOpenState] = useState(false);

  // 등록된 손님 정보 지우기
  const db = getFirestore();
  const queryClient = useQueryClient();

  const deleteGuestData = async (userData: UserData) => {
    const calcelWaitingState = deleteDoc(
      doc(db, `storeList/${admin}/waitingList`, `${userData.uid}`)
    )
      .then((data) => "delete-success")
      .catch((error) => error.message);
    return calcelWaitingState;
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

  return (
    <>
      <Flex
        direction="row"
        padding="0.5rem"
        justify="space-between"
        width="100%"
        backgroundColor="#ffffff"
        borderTop="1px solid black"
        onClick={() => setOpenState(!openState)}
        cursor="pointer"
      >
        <Flex direction="column" gap="0.25rem">
          <Flex
            direction="row"
            gap="0.5rem"
            margin="0.5rem"
            fontSize="1rem"
            pointerEvents="none"
          >
            <Text fontWeight="bold">{userData.name}</Text> 님
          </Flex>
          <Flex
            direction="row"
            gap="0.5rem"
            alignItems="center"
            fontSize="0.75rem"
            margin="0.25rem 0"
            pointerEvents="none"
          >
            <Text margin="0 0.5rem" fontWeight="bold">
              11:59
            </Text>
            <Flex direction="row" gap="0.25rem">
              성인 <Text fontWeight="bold">{userData.member}명</Text>
            </Flex>
            <Flex direction="row" gap="0.25rem">
              유아 <Text fontWeight="bold">2명</Text>
            </Flex>
            <Text fontWeight="bold">·</Text>
            <Text>옵션</Text>
          </Flex>
        </Flex>
        <Flex direction="row" align="center" gap="1rem" margin="0 0.5rem">
          <Link href="tel:01075520121" onClick={(e) => e.stopPropagation()}>
            <Button
              width="3rem"
              height="3rem"
              backgroundColor="green"
              fontSize="0.5rem"
              color="#ffffff"
              fontWeight="normal"
            >
              전화
            </Button>
          </Link>

          <Button
            width="3rem"
            height="3rem"
            backgroundColor="#4E95FF"
            fontSize="0.5rem"
            color="#ffffff"
            fontWeight="normal"
            onClick={(e) => deleteGuestDataByEntered(e, userData)}
          >
            입장 완료
          </Button>
        </Flex>
      </Flex>

      {openState ? (
        <Flex
          direction="row"
          padding="1rem"
          justify="flex-start"
          width="100%"
          fontSize="0.75rem"
          backgroundColor="#5A5A5A"
          gap="1rem"
        >
          <Text color="#ffffff">옵션 사항</Text>
          <Text color="yellow">반려 동물</Text>
        </Flex>
      ) : (
        <></>
      )}
    </>
  );
};

export default WaitingDataBlock;
