import React, { useState } from "react";
import { UserData } from "../../../utils/typealies";
import {
  Flex,
  FormLabel,
  Text,
  Button,
  ListItem,
  UnorderedList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
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
        <ModalContent wordBreak="keep-all" padding="2rem 0" margin="auto 1rem">
          <ModalHeader
            as="h2"
            textAlign="center"
            fontSize="1rem"
            letterSpacing="-0.05rem"
            color="subBlue"
          >
            등록이 완료되었습니다!
          </ModalHeader>
          <ModalBody
            textAlign="center"
            fontSize={visionState === false ? "1rem" : "1.625rem"}
            letterSpacing="-0.05rem"
          >
            <Text margin="1rem 0">
              아래 버튼을 누르시면 등록하신 대기 정보를 확인하실 수 있습니다.
            </Text>
            <ModalFooter justifyContent="center" padding="0 1rem">
              <Button
                type="button"
                background="accentGray"
                color="#ffffff"
                padding="1.5rem"
                margin="0.5rem 0"
                borderRadius="0.25rem"
                width="100%"
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
        <ModalContent padding="2rem 0 1rem 0" margin="auto 1rem">
          <ModalHeader
            as="h2"
            fontSize={visionState === false ? "1rem" : "1.625rem"}
            textAlign="center"
            fontWeight="bold"
            letterSpacing="-0.05rem"
          >
            작성 내용을 확인해주세요.
          </ModalHeader>
          <ModalBody>
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <FormLabel
                fontSize={visionState === false ? "1rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                성함
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1rem" : "1.625rem"}
                color="mainBlue"
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
                fontSize={visionState === false ? "1rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                연락처
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1rem" : "1.625rem"}
                color="mainBlue"
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
                fontSize={visionState === false ? "1rem" : "1.625rem"}
                fontWeight="500"
                width="30%"
                margin="0"
              >
                인원
              </FormLabel>
              <Text
                fontSize={visionState === false ? "1rem" : "1.625rem"}
                color="mainBlue"
                fontWeight="600"
              >
                {userInfo.member}명
              </Text>
            </Flex>
            {userInfo.pet === true ? (
              <Flex direction="column" margin="0.5rem 0">
                <FormLabel
                  fontSize={visionState === false ? "1rem" : "1.625rem"}
                  fontWeight="500"
                  width="30%"
                  margin="0"
                >
                  추가 옵션
                </FormLabel>
                <Flex
                  direction="column"
                  background="#F9F9F9"
                  margin="0.5rem 0"
                  padding="0.5rem"
                >
                  <UnorderedList>
                    {userInfo.pet === true ? (
                      <ListItem
                        display="block"
                        fontSize={
                          visionState === false ? "0.75rem" : "1.625rem"
                        }
                        margin="0.5rem 0"
                        color="subBlue"
                      >
                        반려 동물이 있어요.
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
              margin="0.5rem 0"
              justify="space-between"
            >
              <Button
                type="button"
                background="#58a6dc"
                color="#ffffff"
                padding="1.5rem"
                borderRadius="0.25rem"
                width="100%"
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
                width="100%"
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
