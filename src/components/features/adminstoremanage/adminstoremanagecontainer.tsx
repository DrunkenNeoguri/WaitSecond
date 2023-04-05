import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { EventObject, StoreOption } from "../../../utils/typealies";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommonInput } from "../../common/commoninput";
import CommonErrorMsg from "../../common/commonerrormsg";
import { useNavigate } from "react-router-dom";
import { tokenExpirationCheck } from "../../../utils/verifiedcheck";
import CommonLoadingModal from "../../common/commonloadingmodal";
import { loginStateCheck } from "../../../utils/verifiedcheck";
import { useMetaTag, useTitle } from "../../../utils/customhook";

const AdminStoreManageContainer: React.FC = () => {
  useTitle("매장 관리 ::: 웨잇세컨드");
  useMetaTag({
    title: "매장 관리 ::: 웨잇세컨드",
  });
  const db = getFirestore();
  // const firebaseAuth = getAuth();
  const queryClient = useQueryClient();
  const toastMsg = useToast();
  const navigate = useNavigate();
  const currentUser = loginStateCheck();

  // interface에서 class로 바꿀 수 있는지 확인해보기
  const initialState = {
    uid: "",
    storeName: "",
    storebg: "",
    waitingState: false,
    maximumTeamMemberCount: 1,
    maximumWaitingTeamCount: 1,
    petAllow: false,
    teamSeparate: false,
    customOption1Name: "",
    customOption1State: false,
    customOption2Name: "",
    customOption2State: false,
    customOption3Name: "",
    customOption3State: false,
    firstSetting: false,
  };

  const [storeData, setStoreData] = useState<StoreOption>(initialState);
  const [documentUID, setDocumentUID] = useState("");
  const [inputCheck, setInputCheck] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingModal, setLoadingModal] = useState(true);

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
  });

  // 설정 적용하기 (입력값)
  const inputStoreOptionData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setStoreData({ ...storeData, [id]: value });

    if (inputCheck === false) {
      setInputCheck(true);
    }
  };

  // 설정 적용하기 (+-)
  const changeStoreOptionCounter = (e: React.MouseEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.currentTarget;

    switch (id) {
      case "maximumTeamMemberCount": {
        if (Number(value)! === -1 && storeData.maximumTeamMemberCount > 1) {
          setStoreData({
            ...storeData,
            maximumTeamMemberCount: storeData.maximumTeamMemberCount - 1,
          });
        } else if (Number(value)! === 1) {
          setStoreData({
            ...storeData,
            maximumTeamMemberCount: storeData.maximumTeamMemberCount + 1,
          });
        }
        break;
      }
      case "maximumWaitingTeamCount": {
        if (Number(value)! === -1 && storeData.maximumWaitingTeamCount > 1) {
          setStoreData({
            ...storeData,
            maximumWaitingTeamCount: storeData.maximumWaitingTeamCount - 1,
          });
        } else if (Number(value)! === 1) {
          setStoreData({
            ...storeData,
            maximumWaitingTeamCount: storeData.maximumWaitingTeamCount + 1,
          });
        }
        break;
      }
    }
  };

  // 설정 적용하기 (스위치)
  const switchStoreOptionValue = (e: React.MouseEvent, state: boolean) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setStoreData({ ...storeData, [id]: state });
  };

  // 관리자의 설정 정보 가져오기
  const getStoreSettingData = async () => {
    const storeDataState = await getDocs(collection(db, "adminList")).then(
      (data) => {
        let adminData: any;
        data.forEach((doc) => {
          if (doc.data().uid === currentUser) {
            adminData = { data: doc.data(), uid: doc.id };
          }
        });
        return adminData!;
      }
    );
    return storeDataState;
  };

  const currentStoreOption = useQuery({
    queryKey: ["currentStoreOption"],
    queryFn: getStoreSettingData,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      if (data !== undefined) {
        setStoreData(data.data);
        setDocumentUID(data.uid);
        setLoadingModal(false);
      }
    },
  });

  // 관리자의 설정 저장하기
  const updateStoreDataToDatabase = async (storeData: StoreOption) => {
    const updateDataState = await setDoc(
      doc(db, "adminList", documentUID),
      storeData
    )
      .then((data) => "option-setting-success")
      .catch((error) => error.message);
    return updateDataState;
  };

  const updateStoreDataMutation = useMutation(updateStoreDataToDatabase, {
    onError: (error, variable) => console.log(error, variable),
    onSuccess: (data, variable, context) => {
      setLoadingState(false);
      if (data === "option-setting-success") {
        return !toastMsg.isActive("option-setting-success")
          ? toastMsg({
              title: "변경 사항 적용 완료",
              id: "option-setting-success",
              description: "설정하신 사항이 적용됐습니다.",
              status: "success",
              duration: 5000,
              isClosable: true,
            })
          : null;
      }
      queryClient.invalidateQueries(["storeOption"]);
      queryClient.invalidateQueries(["currentStoreOption"]);
    },
  });

  const submitUserWaitingData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    updateStoreDataMutation.mutate(storeData);
  };

  if (currentStoreOption.data !== undefined)
    return (
      <>
        {loadingModal ? <CommonLoadingModal /> : <></>}
        <Flex
          as="article"
          direction="column"
          border="none"
          padding="2rem 1.5rem"
          background="#FFFFFF"
          boxSizing="border-box"
        >
          <Heading as="h1" fontSize="1.5rem" padding="1rem 0">
            매장 관리
          </Heading>
          {currentStoreOption.data !== undefined}
          <form onSubmit={submitUserWaitingData}>
            <FormControl>
              <Flex direction="column" padding="0.5rem 0">
                <CommonInput
                  id="storeName"
                  title="매장명"
                  type="text"
                  value={storeData.storeName}
                  onChange={inputStoreOptionData}
                  margin="0.25rem 0"
                  placeholder="20자 이내"
                  maxLength={20}
                />
                <CommonErrorMsg
                  type="storename"
                  value1={storeData.storeName}
                  inputCheck={{ storename: inputCheck }}
                  fontSize="0.75rem"
                />
              </Flex>
              <Flex direction="column" padding="0.5rem 0 1.5rem 0">
                <FormLabel fontSize="1rem" fontWeight="semibold">
                  배경 이미지
                </FormLabel>
                <Box background="#8D8D8D" width="100%" height="180px" />
                <Button
                  type="button"
                  variant="solid"
                  background="mainBlue"
                  padding="0.5rem auto"
                  fontSize="1.25rem"
                  borderRadius="0.25rem"
                  color="#ffffff"
                  width="100%"
                  height="3rem"
                  margin="1.5rem 0 1rem 0"
                >
                  배경 이미지 변경
                </Button>
              </Flex>

              <Flex direction="column" padding="0.5rem 0" gap="1rem">
                <FormLabel fontSize="1rem" fontWeight="semibold">
                  대기 설정
                </FormLabel>
                <Flex direction="row" justify="space-between" align="center">
                  <Text fontSize="0.875rem">현재 대기 접수 여부</Text>
                  <Flex>
                    <Button
                      id="waitingState"
                      borderRadius="0.25rem 0 0 0.25rem"
                      padding="0px 1.5rem"
                      background={
                        storeData.waitingState ? "mainBlue" : "#FFFFFF"
                      }
                      color={storeData.waitingState ? "#FFFFFF" : "#333333"}
                      borderTop="2px solid"
                      borderBottom="2px solid"
                      borderLeft="2px solid"
                      borderColor={
                        storeData.waitingState ? "mainBlue" : "mainGray"
                      }
                      fontSize="0.75rem"
                      size="sm"
                      onClick={(e) => switchStoreOptionValue(e, true)}
                    >
                      가능
                    </Button>
                    <Button
                      id="waitingState"
                      borderRadius="0 0.25rem 0.25rem 0"
                      padding="0 1.5rem"
                      background={
                        !storeData.waitingState ? "mainBlue" : "#FFFFFF"
                      }
                      color={!storeData.waitingState ? "#FFFFFF" : "#333333"}
                      borderTop="2px solid"
                      borderBottom="2px solid"
                      borderRight="2px solid"
                      borderColor={
                        !storeData.waitingState ? "mainBlue" : "mainGray"
                      }
                      fontSize="0.75rem"
                      size="sm"
                      onClick={(e) => switchStoreOptionValue(e, false)}
                    >
                      불가
                    </Button>
                  </Flex>
                </Flex>
                <Flex direction="row" justify="space-between" align="center">
                  <Text fontSize="0.875rem">최대 대기 접수 가능 인원</Text>
                  <Flex justify="space-between" align="center" width="8.5rem">
                    <Button
                      id="maximumTeamMemberCount"
                      background="mainBlue"
                      color="#FFFFFF"
                      padding="0"
                      size="sm"
                      value={-1}
                      onClick={changeStoreOptionCounter}
                    >
                      <MinusIcon />
                    </Button>
                    <Text>{storeData.maximumTeamMemberCount}명</Text>
                    <Button
                      id="maximumTeamMemberCount"
                      background="mainBlue"
                      color="#FFFFFF"
                      padding="0"
                      size="sm"
                      value={1}
                      onClick={changeStoreOptionCounter}
                    >
                      <AddIcon />
                    </Button>
                  </Flex>
                </Flex>
                <Flex direction="row" justify="space-between" align="center">
                  <Text fontSize="0.875rem">최대 접수 가능 팀 수</Text>
                  <Flex justify="space-between" align="center" width="8.5rem">
                    <Button
                      id="maximumWaitingTeamCount"
                      background="mainBlue"
                      color="#FFFFFF"
                      padding="0"
                      size="sm"
                      value={-1}
                      onClick={changeStoreOptionCounter}
                    >
                      <MinusIcon />
                    </Button>
                    <Text>{storeData.maximumWaitingTeamCount}팀</Text>
                    <Button
                      id="maximumWaitingTeamCount"
                      background="mainBlue"
                      color="#FFFFFF"
                      padding="0"
                      size="sm"
                      value={1}
                      onClick={changeStoreOptionCounter}
                    >
                      <AddIcon />
                    </Button>
                  </Flex>
                </Flex>
                <Flex direction="row" justify="space-between" align="center">
                  <Text fontSize="0.875rem">반려 동물 동반</Text>
                  <Flex>
                    <Button
                      id="petAllow"
                      borderRadius="0.25rem 0 0 0.25rem"
                      padding="0px 1.5rem"
                      background={storeData.petAllow ? "mainBlue" : "#FFFFFF"}
                      color={storeData.petAllow ? "#FFFFFF" : "#333333"}
                      borderTop="2px solid"
                      borderBottom="2px solid"
                      borderLeft="2px solid"
                      borderColor={storeData.petAllow ? "mainBlue" : "mainGray"}
                      fontSize="0.75rem"
                      size="sm"
                      onClick={(e) => switchStoreOptionValue(e, true)}
                    >
                      가능
                    </Button>
                    <Button
                      id="petAllow"
                      borderRadius="0 0.25rem 0.25rem 0"
                      padding="0px 1.5rem"
                      background={!storeData.petAllow ? "mainBlue" : "#FFFFFF"}
                      color={!storeData.petAllow ? "#FFFFFF" : "#333333"}
                      borderTop="2px solid"
                      borderBottom="2px solid"
                      borderRight="2px solid"
                      borderColor={
                        !storeData.petAllow ? "mainBlue" : "mainGray"
                      }
                      fontSize="0.75rem"
                      size="sm"
                      onClick={(e) => switchStoreOptionValue(e, false)}
                    >
                      불가
                    </Button>
                  </Flex>
                </Flex>
                <Flex direction="row" justify="space-between" align="center">
                  <Text fontSize="0.875rem">테이블 인원 따로 앉기</Text>
                  <Flex>
                    <Button
                      id="teamSeparate"
                      borderRadius="0.25rem 0 0 0.25rem"
                      padding="0px 1.5rem"
                      background={
                        storeData.teamSeparate ? "mainBlue" : "#FFFFFF"
                      }
                      color={storeData.teamSeparate ? "#FFFFFF" : "#333333"}
                      borderTop="2px solid"
                      borderBottom="2px solid"
                      borderLeft="2px solid"
                      borderColor={
                        storeData.teamSeparate ? "mainBlue" : "mainGray"
                      }
                      fontSize="0.75rem"
                      size="sm"
                      onClick={(e) => switchStoreOptionValue(e, true)}
                    >
                      가능
                    </Button>
                    <Button
                      id="teamSeparate"
                      borderRadius="0 0.25rem 0.25rem 0"
                      padding="0px 1.5rem"
                      background={
                        !storeData.teamSeparate ? "mainBlue" : "#FFFFFF"
                      }
                      color={!storeData.teamSeparate ? "#FFFFFF" : "#333333"}
                      borderTop="2px solid"
                      borderBottom="2px solid"
                      borderRight="2px solid"
                      borderColor={
                        !storeData.teamSeparate ? "mainBlue" : "mainGray"
                      }
                      fontSize="0.75rem"
                      size="sm"
                      onClick={(e) => switchStoreOptionValue(e, false)}
                    >
                      불가
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              <Flex direction="column" padding="2rem 0 0.5rem" gap="1rem">
                <Heading fontSize="1rem" fontWeight="semibold">
                  커스텀 설정
                </Heading>
                <Flex direction="column" gap="0.5rem">
                  <Flex justify="space-between" align="center">
                    <FormLabel htmlFor="customOption1Name" fontSize="0.875rem">
                      옵션 1
                    </FormLabel>
                    <Flex>
                      <Button
                        id="customOption1State"
                        borderRadius="0.25rem 0 0 0.25rem"
                        padding="0px 1.5rem"
                        background={
                          storeData.customOption1State ? "mainBlue" : "#FFFFFF"
                        }
                        color={
                          storeData.customOption1State ? "#FFFFFF" : "#333333"
                        }
                        borderTop="2px solid"
                        borderBottom="2px solid"
                        borderLeft="2px solid"
                        borderColor={
                          storeData.customOption1State ? "mainBlue" : "mainGray"
                        }
                        fontSize="0.75rem"
                        size="sm"
                        onClick={(e) => switchStoreOptionValue(e, true)}
                      >
                        가능
                      </Button>
                      <Button
                        id="customOption1State"
                        borderRadius="0 0.25rem 0.25rem 0"
                        padding="0px 1.5rem"
                        background={
                          !storeData.customOption1State ? "mainBlue" : "#FFFFFF"
                        }
                        color={
                          !storeData.customOption1State ? "#FFFFFF" : "#333333"
                        }
                        borderTop="2px solid"
                        borderBottom="2px solid"
                        borderRight="2px solid"
                        borderColor={
                          !storeData.customOption1State
                            ? "mainBlue"
                            : "mainGray"
                        }
                        fontSize="0.75rem"
                        size="sm"
                        onClick={(e) => switchStoreOptionValue(e, false)}
                      >
                        불가
                      </Button>
                    </Flex>
                  </Flex>
                  <Input
                    id="customOption1Name"
                    value={storeData.customOption1Name}
                    onChange={inputStoreOptionData}
                    type="text"
                    size="md"
                    background="#F9F9F9"
                    borderColor="#B4B4B4"
                    width="100%"
                    _focus={{ background: "#FFFFFF" }}
                  />
                  <CommonErrorMsg
                    type="custom"
                    inputCheck={{ custom: storeData.customOption1State }}
                    value1={storeData.customOption1Name}
                    fontSize="0.75rem"
                  />
                </Flex>
                <Flex direction="column" gap="0.5rem">
                  <Flex justify="space-between" align="center">
                    <FormLabel htmlFor="customOption2Name" fontSize="0.875rem">
                      옵션 2
                    </FormLabel>
                    <Flex>
                      <Button
                        id="customOption2State"
                        borderRadius="0.25rem 0 0 0.25rem"
                        padding="0px 1.5rem"
                        background={
                          storeData.customOption2State ? "mainBlue" : "#FFFFFF"
                        }
                        color={
                          storeData.customOption2State ? "#FFFFFF" : "#333333"
                        }
                        borderTop="2px solid"
                        borderBottom="2px solid"
                        borderLeft="2px solid"
                        borderColor={
                          storeData.customOption2State ? "mainBlue" : "mainGray"
                        }
                        fontSize="0.75rem"
                        size="sm"
                        onClick={(e) => switchStoreOptionValue(e, true)}
                      >
                        가능
                      </Button>
                      <Button
                        id="customOption2State"
                        borderRadius="0 0.25rem 0.25rem 0"
                        padding="0px 1.5rem"
                        background={
                          !storeData.customOption2State ? "mainBlue" : "#FFFFFF"
                        }
                        color={
                          !storeData.customOption2State ? "#FFFFFF" : "#333333"
                        }
                        borderTop="2px solid"
                        borderBottom="2px solid"
                        borderRight="2px solid"
                        borderColor={
                          !storeData.customOption2State
                            ? "mainBlue"
                            : "mainGray"
                        }
                        fontSize="0.75rem"
                        size="sm"
                        onClick={(e) => switchStoreOptionValue(e, false)}
                      >
                        불가
                      </Button>
                    </Flex>
                  </Flex>
                  <Input
                    id="customOption2Name"
                    value={storeData.customOption2Name}
                    onChange={inputStoreOptionData}
                    type="text"
                    size="md"
                    background="#F9F9F9"
                    borderColor="#B4B4B4"
                    width="100%"
                    _focus={{ background: "#FFFFFF" }}
                  />
                  <CommonErrorMsg
                    type="custom"
                    inputCheck={{ custom: storeData.customOption2State }}
                    value1={storeData.customOption2Name}
                    fontSize="0.75rem"
                  />
                </Flex>
                <Flex direction="column" gap="0.5rem">
                  <Flex justify="space-between" align="center">
                    <FormLabel htmlFor="customOption3Name" fontSize="0.875rem">
                      옵션 3
                    </FormLabel>
                    <Flex>
                      <Button
                        id="customOption3State"
                        borderRadius="0.25rem 0 0 0.25rem"
                        padding="0px 1.5rem"
                        background={
                          storeData.customOption3State ? "mainBlue" : "#FFFFFF"
                        }
                        color={
                          storeData.customOption3State ? "#FFFFFF" : "#333333"
                        }
                        borderTop="2px solid"
                        borderBottom="2px solid"
                        borderLeft="2px solid"
                        borderColor={
                          storeData.customOption3State ? "mainBlue" : "mainGray"
                        }
                        fontSize="0.75rem"
                        size="sm"
                        onClick={(e) => switchStoreOptionValue(e, true)}
                      >
                        가능
                      </Button>
                      <Button
                        id="customOption3State"
                        borderRadius="0 0.25rem 0.25rem 0"
                        padding="0px 1.5rem"
                        background={
                          !storeData.customOption3State ? "mainBlue" : "#FFFFFF"
                        }
                        color={
                          !storeData.customOption3State ? "#FFFFFF" : "#333333"
                        }
                        borderTop="2px solid"
                        borderBottom="2px solid"
                        borderRight="2px solid"
                        borderColor={
                          !storeData.customOption3State
                            ? "mainBlue"
                            : "mainGray"
                        }
                        fontSize="0.75rem"
                        size="sm"
                        onClick={(e) => switchStoreOptionValue(e, false)}
                      >
                        불가
                      </Button>
                    </Flex>
                  </Flex>
                  <Input
                    id="customOption3Name"
                    value={storeData.customOption3Name}
                    onChange={inputStoreOptionData}
                    type="text"
                    size="md"
                    background="#F9F9F9"
                    borderColor="#B4B4B4"
                    width="100%"
                    _focus={{ background: "#FFFFFF" }}
                  />
                  <CommonErrorMsg
                    type="custom"
                    inputCheck={{ custom: storeData.customOption3State }}
                    value1={storeData.customOption3Name}
                    fontSize="0.75rem"
                  />
                </Flex>
              </Flex>
              <Button
                type="submit"
                variant="solid"
                background="mainBlue"
                padding="0.5rem auto"
                fontSize="1.25rem"
                borderRadius="0.25rem"
                color="#ffffff"
                width="100%"
                height="3rem"
                margin="1.5rem 0 1rem 0"
                isLoading={loadingState}
              >
                변경 사항 적용
              </Button>
            </FormControl>
          </form>
        </Flex>
      </>
    );
  else return <CommonLoadingModal />;
};

export default AdminStoreManageContainer;
