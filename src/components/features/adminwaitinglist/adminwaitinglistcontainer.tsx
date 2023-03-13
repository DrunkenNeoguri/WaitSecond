import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { UserData } from "../../../utils/typealies";
import WaitingDataBlock from "./waitingdatablock";

const AdminWaitingListContainer = () => {
  const db = getFirestore();
  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser?.uid;

  // 현재 가게 대기 정보 가져오기
  const waitingCol = query(
    collection(db, `storeList/${currentUser}/waitingList`)
  );

  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      data.forEach((doc) => {
        const userData = doc.data();
        list.push({ ...userData, uid: doc.id });
      });
      list.sort(function (a: any, b: any) {
        return a.createdAt - b.createdAt;
      });
      return list;
    });
    return waitingState;
  };

  const currentWaitingState = useQuery({
    queryKey: ["currentWaitingState"],
    queryFn: getWaitingData,
  });

  console.log(currentWaitingState.data);

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
        {currentWaitingState.data?.map((elem: UserData) => {
          return (
            <WaitingDataBlock
              key={elem.uid!}
              userData={elem}
              admin={currentUser!}
            />
          );
        })}
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
