import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { lowVisionState } from "../../../modules/atoms/atoms";
import { StoreOption, UserData } from "../../../utils/typealies";

const WaitingStateContainer = () => {
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { storeuid, telnumber } = useParams();

  const db = getFirestore();
  const waitingCol = query(collection(db, `storeList/${storeuid}/waitingList`));

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

  const getStoreSettingData = async () => {
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

  const storeData = useQuery({
    queryKey: ["storeData"],
    queryFn: getStoreSettingData,
  });

  // findIndex = 배 열 내에서 조건에 해당하는 데이터의 index를 반환함.
  const currentUserIdx = waitingList.data?.findIndex(
    (elem: UserData) => elem.tel === telnumber
  );

  const currentUserData = waitingList.data?.[currentUserIdx];

  const cancelWaitingAccount = async () => {
    const calcelWaitingState = deleteDoc(
      doc(db, `${storeuid}`, currentUserData.tel)
    )
      .then((data) => true)
      .catch((error) => error.message);
    return calcelWaitingState;
  };

  const deleteMutation = useMutation(cancelWaitingAccount, {
    onError: (error, variable) => console.log(error),
    onSuccess: (data, variable, context) => {},
  });

  const deleteWaitingData = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteMutation.mutate(currentUserData);
  };

  return (
    <section style={{ background: "#EDEDED", padding: "1rem 0" }}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent padding="2rem 0">
          <ModalHeader as="h1" textAlign="center" fontSize="1.5rem">
            정말로 대기 등록을 취소하시겠습니까?
          </ModalHeader>
          <ModalBody
            textAlign="center"
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          >
            취소 시, 등록하신 정보는 삭제되며 재등록을 원하실 경우 처음부터 다시
            등록해주셔야 합니다.
          </ModalBody>
          <Flex direction="row" gap="1rem" margin="1rem 0 0 0" justify="center">
            <Button
              type="button"
              background="#58a6dc"
              color="#ffffff"
              padding="1.5rem"
              borderRadius="0.25rem"
              fontSize={visionState === false ? "1.25rem" : "1.625rem"}
              onClick={deleteWaitingData}
            >
              취소할게요
            </Button>
            <Button
              type="button"
              background="#5a5a5a"
              color="#ffffff"
              padding="1.5rem"
              borderRadius="0.25rem"
              onClick={onClose}
              fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            >
              아니에요
            </Button>
          </Flex>
        </ModalContent>
      </Modal>

      {waitingList.data === undefined || storeData.data === undefined ? (
        <Flex
          direction="column"
          align="center"
          background="#ffffff"
          padding="3rem 1rem"
          margin="5rem 1rem 0 1rem"
          borderRadius="1rem"
          boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        >
          <Skeleton textAlign="center" height="2.5rem" width="50vw" />

          <Flex
            direction="row"
            justify="space-between"
            align="center"
            margin="1.5rem 0"
            width="100%"
          >
            <Skeleton height="1.5rem" width="30vw" />
            <Skeleton height="2.25rem" width="20vw" />
          </Flex>

          <Flex direction="column" margin="0.25rem 0" width="100%" gap="1rem">
            <Skeleton height="1.75rem" width="50vw" />
            <Skeleton height="1.75rem" width="70vw" />
          </Flex>
          <Box
            display="block"
            background="#d4d4d4"
            height="0.125rem"
            width="70vw"
            borderRadius="1rem"
            boxSizing="border-box"
            margin="2rem 1rem"
          />
          <Skeleton height="2rem" width="30vw" margin="0 auto 0 0" />

          <Flex direction="column" width="100%">
            <Flex
              direction="row"
              justify="space-between"
              align="center"
              margin="1.5rem 0"
            >
              <Skeleton height="1.75rem" width="20vw" />
              <Skeleton height="2.25rem" width="20vw" />
            </Flex>
          </Flex>
          <Flex direction="column" gap="1rem" width="100%">
            <Skeleton height="1.75rem" width="30vw" />
            <Skeleton height="1.75rem" width="60vw" margin="0 0 0 10vw" />
            <Skeleton height="1.75rem" width="60vw" margin="0 0 0 10vw" />
            <Skeleton height="1.75rem" width="60vw" margin="0 0 0 10vw" />
            <Skeleton height="1.75rem" width="60vw" margin="0 0 0 10vw" />
          </Flex>
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            margin="2rem 0"
            width="100%"
          >
            <Skeleton height="1rem" width="20vw" />
            <Skeleton height="1rem" width="50vw" />
          </Flex>
          <Skeleton height="2.5rem" width="80vw" />
        </Flex>
      ) : (
        <Flex
          as="article"
          direction="column"
          background="#ffffff"
          padding="3rem 1rem"
          margin="5rem 1rem 0 1rem"
          border="none"
          borderRadius="1rem"
          boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        >
          <Heading as="h1" textAlign="center">
            {storeData.data === undefined
              ? "불러오는중불러오는중불러오는중불러오는중"
              : storeData.data.storeName}
          </Heading>
          <Flex
            direction="row"
            justify="space-between"
            align="center"
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            margin="1.5rem 0"
          >
            <Text fontWeight="600">내 앞 대기팀</Text>
            <Text fontSize="1.75rem" fontWeight="700" color="#58a6dc">
              {currentUserIdx === 0 ? "없음" : `${currentUserIdx} 팀`}
            </Text>
          </Flex>

          <Text
            borderRadius="0.25rem"
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            letterSpacing="-2%"
            lineHeight={visionState === false ? "2rem" : "2.25rem"}
            margin="0.25rem 0"
            whiteSpace="pre-wrap"
            textAlign="left"
            color="#4E95FF"
          >
            순서가 가까워졌어요.
            <br />
            가게 근처에서 기다려주세요.
          </Text>
          <Box
            display="block"
            background="#d4d4d4"
            height="0.125rem"
            borderRadius="1rem"
            boxSizing="border-box"
            margin="2rem 1rem"
          />
          <Heading
            as="h2"
            fontWeight="600"
            fontSize={visionState === false ? "1.5rem" : "1.625rem"}
          >
            내 정보
          </Heading>
          <Flex direction="column">
            <Flex
              direction="row"
              justify="space-between"
              align="center"
              fontSize={visionState === false ? "1.25rem" : "1.625rem"}
              margin="1.5rem 0"
            >
              <Text fontWeight="600">인원</Text>
              <Text fontSize="1.75rem" fontWeight="700" color="#58a6dc">
                {currentUserData.member}명
              </Text>
            </Flex>
          </Flex>
          <Text
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            fontWeight="600"
          >
            추가 옵션
          </Text>
          <UnorderedList
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
          >
            {currentUserData.child === true ? (
              <ListItem
                display="flex"
                flexDirection="row"
                alignItems="center"
                margin="1rem 0"
              >
                <ListIcon as={CheckCircleIcon} />
                <Text color="#58a6dc" fontWeight="600">
                  아이
                </Text>
                가 있어요.
              </ListItem>
            ) : (
              <></>
            )}
            {currentUserData.pet === true ? (
              <ListItem
                display="flex"
                flexDirection="row"
                alignItems="center"
                margin="1rem 0"
              >
                <ListIcon as={CheckCircleIcon} />
                <Text color="#58a6dc" fontWeight="600">
                  반려 동물
                </Text>
                이 있어요.
              </ListItem>
            ) : (
              <></>
            )}
          </UnorderedList>
          <Flex
            direction={visionState === false ? "row" : "column"}
            justify="space-between"
            align={visionState === false ? "center" : "flex-start"}
            fontSize={visionState === false ? "1rem" : "1.625rem"}
            margin="1rem 0 2rem 0"
            color="#8F8F8F"
          >
            <Text>대기 시작 시간</Text>
            <Text>2021-01-30 11:59</Text>
          </Flex>
          <Button
            type="button"
            background="#5a5a5a"
            color="#ffffff"
            borderRadius="0.25rem"
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            fontWeight="500"
            size="lg"
            onClick={onOpen}
          >
            대기 등록 취소
          </Button>
        </Flex>
      )}
    </section>
  );
};

export default WaitingStateContainer;
