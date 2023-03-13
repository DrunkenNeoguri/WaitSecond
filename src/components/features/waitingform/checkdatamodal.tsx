import React, { useState } from "react";
import { UserData } from "../../../utils/typealies";
import {
  Flex,
  FormLabel,
  Text,
  Button,
  ListItem,
  ListIcon,
  UnorderedList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { lowVisionState } from "../../../modules/atoms/atoms";
import { useRecoilValue } from "recoil";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const CheckDataModal: React.FC<{
  userInfo: UserData;
  isOpen: boolean;
  onClose: () => void;
}> = ({ userInfo, isOpen, onClose }) => {
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const [registerState, setRegisterState] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { storeuid } = useParams();

  const db = getFirestore();

  const sendWaitingDataToDatabase = async (userInfo: UserData) => {
    const sendUserData = {
      ...userInfo,
      createdAt: new Date().getTime(),
    };
    const addWaitingData = await addDoc(
      collection(db, `storeList/${storeuid}/waitingList`),
      sendUserData
    )
      .then((data) => data)
      .catch((error) => error.message);
    return addWaitingData;
  };

  const waitingMutation = useMutation(sendWaitingDataToDatabase, {
    onError: (error, variable) => console.log(error, variable),
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries(["waitingList"]);
      queryClient.invalidateQueries(["storeData"]);
      setRegisterState(true);
    },
  });

  const submitUserWaitingData = (e: React.MouseEvent, userData: UserData) => {
    e.preventDefault();
    waitingMutation.mutate(userData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      {registerState === true ? (
        <ModalContent wordBreak="keep-all" padding="2rem 0">
          <ModalHeader as="h1" textAlign="center" fontSize="1.5rem">
            등록이 완료되었습니다!
          </ModalHeader>
          <ModalBody
            textAlign="center"
            fontSize={visionState === false ? "1rem" : "1.625rem"}
          >
            <Text margin="1rem 0">
              5초 뒤에 자동으로 대기 상황 페이지로 이동합니다.
            </Text>
            <ModalFooter justifyContent="center">
              <Button
                type="button"
                background="#5a5a5a"
                color="#ffffff"
                padding="1.5rem"
                borderRadius="0.25rem"
                onClick={() => {
                  onClose();
                  setRegisterState(false);
                  navigate(`/${storeuid}/waitingstate/${userInfo.tel}`);
                }}
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
              >
                바로 이동하기
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      ) : (
        <ModalContent padding="2rem 0">
          <ModalHeader
            as="h2"
            fontSize={visionState === false ? "1.25rem" : "1.625rem"}
            textAlign="center"
            marginBottom="1.5rem"
          >
            작성 내용을{visionState === false ? " " : <br />}확인해주세요.
          </ModalHeader>
          <ModalBody>
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <FormLabel
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                성함
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                color="#58a6dc"
                fontWeight="600"
              >
                {userInfo.name}
              </Text>
            </Flex>
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <FormLabel
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                연락처
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                color="#58a6dc"
                fontWeight="600"
              >
                {" "}
                {userInfo.tel}
              </Text>
            </Flex>
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <FormLabel
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                인원
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                color="#58a6dc"
                fontWeight="600"
              >
                {userInfo.member}명
              </Text>
            </Flex>
            {userInfo.pet === true || userInfo.child === true ? (
              <Flex direction="column" margin="0.5rem 0">
                <FormLabel
                  fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                  fontWeight="500"
                  width="30%"
                  margin="0"
                >
                  옵션
                </FormLabel>
                <Flex direction="column">
                  <UnorderedList>
                    {userInfo.child === true ? (
                      <ListItem
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        fontSize={
                          visionState === false ? "1.25rem" : "1.625rem"
                        }
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
                    {userInfo.pet === true ? (
                      <ListItem
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        fontSize={
                          visionState === false ? "1.25rem" : "1.625rem"
                        }
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
                </Flex>
              </Flex>
            ) : (
              <></>
            )}
            <Flex
              direction="row"
              gap="1rem"
              margin="2rem 0 0 0"
              justify="center"
            >
              <Button
                type="button"
                background="#58a6dc"
                color="#ffffff"
                padding="1.5rem"
                borderRadius="0.25rem"
                fontSize={visionState === false ? "1.25rem" : "1.625rem"}
                onClick={(e) => submitUserWaitingData(e, userInfo)}
              >
                맞습니다
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
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};

export default CheckDataModal;

// <Flex
// direction="column"
// background="#ffffff"
// margin="10vh 1rem"
// padding="3rem 1.5rem"
// justify="center"
// borderRadius="0.5rem"
// >
