import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import WaitingDataBlock from "./waitingdatablock";

const AdminWaitingListContainer = () => {
  // const db = getFirestore();
  // const waitingCol = collection(db, "adg");

  // const getWaitingData = async () => {
  //   const waitingState = await getDocs(waitingCol).then((data) => {
  //     const list: any = [];
  //     data.forEach((doc) => {
  //       list.push(doc.data());
  //     });
  //     list.sort(function (a: any, b: any) {
  //       return a.createdAt - b.createdAt;
  //     });
  //     return list;
  //   });
  //   return waitingState;
  // };

  // const waitingList = useQuery({
  //   queryKey: ["waitingList"],
  //   queryFn: getWaitingData,
  // });

  return (
    <Flex
      as="article"
      direction="column"
      border="none"
      borderRadius="1rem 1rem 0 0"
      boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
      paddingTop="3.5rem"
    >
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        fontSize="1.5rem"
        padding="1rem"
        backgroundColor="#ffffff"
      >
        <Text letterSpacing="-0.1rem">현재 대기중인 팀</Text>
        <Text fontWeight="bold" color="#58a6dc">
          4팀
        </Text>
      </Flex>
      <Flex direction="column" align="center" fontSize="1.25rem">
        <WaitingDataBlock />
        <WaitingDataBlock />
        <WaitingDataBlock />
        <WaitingDataBlock />
        <WaitingDataBlock />
      </Flex>
    </Flex>
  );
};

export default AdminWaitingListContainer;

// <Text>현재 대기 팀</Text>
// <Text fontSize="1.75rem" fontWeight="700" color="#58a6dc">
//   {waitingList.data === undefined
//     ? "확인 중"
//     : waitingList.data.length === 0
//     ? "없음"
//     : `${waitingList.data.length} 팀`}
// </Text>
