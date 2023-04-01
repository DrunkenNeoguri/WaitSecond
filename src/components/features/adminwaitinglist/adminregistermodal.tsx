import {
  Button,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormControl,
  useToast,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import { useState } from "react";
import { loginStateCheck } from "../../../utils/verifiedcheck";
import { telRegex } from "../../../utils/reqlist";
import { EventObject, UserData } from "../../../utils/typealies";
import CommonErrorMsg from "../../common/commonerrormsg";
import { CommonInput } from "../../common/commoninput";

const AdminRegisterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  modifyData?: UserData;
  modify?: boolean;
  storeuid?: string | undefined;
}> = ({ isOpen, onClose, modifyData, modify, storeuid }) => {
  const db = getFirestore();
  const waitingCol = query(
    collection(
      db,
      `storeList/${
        storeuid === undefined ? loginStateCheck() : storeuid
      }/waitingList`
    )
  );
  const initialState =
    modifyData === undefined
      ? new UserData(
          false,
          "",
          "",
          0,
          0,
          false,
          false,
          false,
          false,
          false,
          0,
          ""
        )
      : modifyData;

  const [userData, setUserData] = useState<UserData>(initialState);
  const [loadingState, setLoadingState] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    customername: false,
    tel: false,
  });
  const toastMsg = useToast();
  const queryClient = useQueryClient();

  // 현재 대기열 가져오기
  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      data.forEach((doc) => {
        if (doc.data().isentered === false) {
          list.push(doc.data());
        }
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

  // 관리자가 설정한 매장 관리 정보 가져오기
  const getStoreOption = async () => {
    const storeDataState = await getDocs(collection(db, "adminList")).then(
      (data) => {
        let adminData: any;
        data.forEach((doc) => {
          if (storeuid === undefined) {
            if (doc.data().uid === loginStateCheck()) {
              return (adminData = doc.data());
            }
          } else if (storeuid !== undefined) {
            if (doc.data().uid === storeuid) {
              return (adminData = doc.data());
            }
          }
        });
        return adminData;
      }
    );
    return storeDataState;
  };

  const { data } = useQuery({
    queryKey: ["storeOption"],
    queryFn: getStoreOption,
  });

  // 데이터 입력 정보 반영하기
  const changeCheckState = (e: React.ChangeEvent, state: boolean) => {
    e.preventDefault();
    setUserData({ ...userData, [e.currentTarget.id]: !state });
  };

  const inputUserText = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setUserData({ ...userData, [id]: value });

    if (e.target.id === "name" && inputCheck.customername === false) {
      setInputCheck({ ...inputCheck, customername: true });
    }
    if (e.target.id === "tel" && inputCheck.tel === false) {
      setInputCheck({ ...inputCheck, tel: true });
    }
  };

  const changeMemberCount = (e: React.MouseEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.currentTarget;

    switch (id) {
      case "adult": {
        if (Number(value)! === -1 && userData.adult > 0) {
          setUserData({
            ...userData,
            adult: userData.adult - 1,
          });
        } else if (
          Number(value)! === 1 &&
          data?.maximumTeamMemberCount! > userData.adult + userData.child
        ) {
          setUserData({
            ...userData,
            adult: userData.adult + 1,
          });
        }
        break;
      }
      case "child": {
        if (Number(value)! === -1 && userData.child > 0) {
          setUserData({
            ...userData,
            child: userData.child - 1,
          });
        } else if (
          Number(value)! === 1 &&
          data?.maximumTeamMemberCount! > userData.adult + userData.child
        ) {
          setUserData({
            ...userData,
            child: userData.child + 1,
          });
        }
        break;
      }
    }
  };

  // DB에 데이터 전달
  const submitUserData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);

    if (userData.name.trim() === "") {
      setLoadingState(false);
      return !toastMsg.isActive("error-nameCheck")
        ? toastMsg({
            title: "성함 확인",
            id: "error-nameCheck",
            description: "성함을 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    if (userData.tel === "" || telRegex.test(userData.tel) === false) {
      setLoadingState(false);
      return !toastMsg.isActive("error-telCheck")
        ? toastMsg({
            title: "연락처 확인",
            id: "error-telCheck",
            description: "연락처를 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    if (userData.child === 0 && userData.adult === 0) {
      setLoadingState(false);
      return !toastMsg.isActive("error-memberCheck")
        ? toastMsg({
            title: "인원 수 확인",
            id: "error-memberCheck",
            description: "인원 수를 정확하게 입력하셨는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    const currentWaitingList = waitingList.data;
    let duplicateCheck;
    currentWaitingList.forEach((doc: UserData) => {
      if (doc.tel === userData.tel) {
        duplicateCheck = true;
      }
    });

    if (duplicateCheck === true) {
      setLoadingState(false);
      return !toastMsg.isActive("error-duplicateNumber")
        ? toastMsg({
            title: "이미 등록된 정보",
            id: "error-duplicateNumber",
            description: "이미 해당 번호로 대기를 등록하셨습니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : undefined;
    }

    waitingMutation.mutate(userData);
  };

  const sendWaitingDataToDatabase = async (userInfo: UserData) => {
    const sendUserData = {
      ...userInfo,
      createdAt: new Date().getTime(),
    };
    if (modify === true) {
      const modifyWaitingData = await setDoc(
        doc(
          db,
          `storeList/${
            storeuid === undefined ? loginStateCheck() : storeuid
          }/waitingList`,
          `${modifyData?.uid}`
        ),
        userData
      )
        .then((data) => {
          return "modify-success";
        })
        .catch((error) => console.log(error.message));
      return modifyWaitingData;
    } else if (modify === false) {
      const addWaitingData = await addDoc(
        collection(db, `storeList/${loginStateCheck()}/waitingList`),
        sendUserData
      )
        .then((data) => "register-success")
        .catch((error) => error.message);
      return addWaitingData;
    }
  };

  const waitingMutation = useMutation(sendWaitingDataToDatabase, {
    onError: (error, variable) => setLoadingState(false),
    onSuccess: (data, variable, context) => {
      if (data === "register-success" || data === "modify-success") {
        setLoadingState(false);
        setUserData(initialState);
        setInputCheck({
          customername: false,
          tel: false,
        });
        queryClient.invalidateQueries(["waitingList"]);
        queryClient.invalidateQueries(["storeOption"]);
        queryClient.invalidateQueries(["currentWaitingState"]);
      }
      onClose();
    },
  });

  const closeRegisterModal = () => {
    setUserData(initialState);
    setInputCheck({
      customername: false,
      tel: false,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeRegisterModal}>
      <ModalOverlay />
      <ModalContent
        wordBreak="keep-all"
        padding="2rem 0 0 0"
        margin="2rem 1rem"
      >
        <ModalHeader
          fontSize="1.25rem"
          fontWeight="semibold"
          padding="0 1.5rem"
        >
          대기 예약 정보 입력
        </ModalHeader>
        <ModalBody
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <form onSubmit={submitUserData}>
            <FormControl>
              <CommonInput
                id="name"
                title="예약자명"
                type="text"
                value={userData.name}
                onChange={inputUserText}
                margin="0.25rem 0"
              />
              <CommonErrorMsg
                type="customername"
                value1={userData.name!}
                inputCheck={inputCheck}
              />
              <CommonInput
                id="tel"
                title="연락처"
                type="tel"
                value={userData.tel}
                onChange={inputUserText}
                margin="0.25rem 0"
                placeholder="'-' 빼고 입력해주세요."
                isDisabled={modify ? true : false}
              />
              <CommonErrorMsg
                type="tel"
                value1={userData.tel}
                inputCheck={inputCheck}
              />
              <Flex direction="column" margin="0.5rem 0 0.5rem 0">
                <Text fontWeight="bold" textAlign="left" margin="0.5rem 0">
                  인원을 선택하세요. (최대 인원: {data?.maximumTeamMemberCount}
                  명)
                </Text>
                <Flex justify="space-between" align="center" margin="0.5rem 0">
                  <FormLabel fontSize="1rem" fontWeight="semibold" margin="0">
                    성　인
                  </FormLabel>
                  <Flex justify="space-between" align="cneter">
                    <Button
                      size="sm"
                      id="adult"
                      value={-1}
                      onClick={changeMemberCount}
                      background="subBlue"
                      fontSize="0.875rem"
                      color="#FFFFFF"
                      borderRadius="0.25rem"
                      padding="0"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <Flex
                      justify="center"
                      align="center"
                      height="auto"
                      fontSize="1rem"
                      color="#000000"
                      padding="0 1rem"
                      width="5rem"
                    >
                      {userData.adult}명
                    </Flex>

                    <Button
                      size="sm"
                      id="adult"
                      value={1}
                      onClick={changeMemberCount}
                      background="subBlue"
                      fontSize="1rem"
                      color="#FFFFFF"
                      borderRadius="0.25rem"
                      padding="0"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Flex>
                </Flex>
                <Flex justify="space-between" align="center" margin="0.5rem 0">
                  <FormLabel fontSize="1rem" fontWeight="semibold" margin="0">
                    유　아
                  </FormLabel>
                  <Flex justify="space-between" align="cneter">
                    <Button
                      size="sm"
                      id="child"
                      value={-1}
                      onClick={changeMemberCount}
                      background="subBlue"
                      fontSize="0.875rem"
                      color="#FFFFFF"
                      borderRadius="0.25rem"
                      padding="0"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <Flex
                      justify="center"
                      align="center"
                      height="auto"
                      fontSize="1rem"
                      color="#000000"
                      padding="0 1rem"
                      width="5rem"
                    >
                      {userData.child}명
                    </Flex>

                    <Button
                      size="sm"
                      id="child"
                      value={1}
                      onClick={changeMemberCount}
                      background="subBlue"
                      fontSize="1rem"
                      color="#FFFFFF"
                      borderRadius="0.25rem"
                      padding="0"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
              {!data?.petAllow &&
              !data?.teamSeparate &&
              !data?.customOption1State &&
              !data?.customOption2State &&
              !data?.customOption3State ? (
                <></>
              ) : (
                <Flex
                  direction="column"
                  background="#F9F9F9"
                  padding="0.75rem"
                  margin="1rem 0"
                >
                  {data?.petAllow ? (
                    <Flex
                      align="center"
                      margin="0.25rem 0"
                      fontSize="0.75rem"
                      letterSpacing="-0.05rem"
                    >
                      <Checkbox
                        size="md"
                        id="pet"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.pet!)
                        }
                        borderRadius="0.5rem"
                        isChecked={userData.pet === false ? false : true}
                        variant="customBlue"
                      />
                      <FormLabel
                        fontWeight="500"
                        width="auto"
                        margin="0 0.5rem"
                        htmlFor="pet"
                        cursor="pointer"
                        fontSize="0.75rem"
                      >
                        반려 동물이 있어요.
                      </FormLabel>
                    </Flex>
                  ) : (
                    <></>
                  )}
                  {data?.teamSeparate ? (
                    <Flex
                      align="center"
                      margin="0.25rem 0"
                      fontSize="0.75rem"
                      letterSpacing="-0.05rem"
                    >
                      <Checkbox
                        size="md"
                        id="separate"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.separate!)
                        }
                        borderRadius="0.5rem"
                        isChecked={userData.separate === false ? false : true}
                        variant="customBlue"
                      />
                      <FormLabel
                        fontWeight="500"
                        width="auto"
                        margin="0 0.5rem"
                        htmlFor="separate"
                        cursor="pointer"
                        fontSize="0.75rem"
                      >
                        자리가 나면 따로 앉아도 괜찮아요.
                      </FormLabel>
                    </Flex>
                  ) : (
                    <></>
                  )}
                  {data?.customOption1State ? (
                    <Flex
                      align="center"
                      margin="0.25rem 0"
                      fontSize="0.75rem"
                      letterSpacing="-0.05rem"
                    >
                      <Checkbox
                        size="md"
                        id="custom1"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.custom1!)
                        }
                        borderRadius="0.5rem"
                        isChecked={userData.custom1 === false ? false : true}
                        variant="customBlue"
                      />
                      <FormLabel
                        fontWeight="500"
                        width="auto"
                        margin="0 0.5rem"
                        htmlFor="custom1"
                        cursor="pointer"
                        fontSize="0.75rem"
                      >
                        {data?.customOption1Name}
                      </FormLabel>
                    </Flex>
                  ) : (
                    <></>
                  )}
                  {data?.customOption2State ? (
                    <Flex
                      align="center"
                      margin="0.25rem 0"
                      fontSize="0.75rem"
                      letterSpacing="-0.05rem"
                    >
                      <Checkbox
                        size="md"
                        id="custom2"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.custom2!)
                        }
                        borderRadius="0.5rem"
                        isChecked={userData.custom2 === false ? false : true}
                        variant="customBlue"
                      />
                      <FormLabel
                        fontWeight="500"
                        width="auto"
                        margin="0 0.5rem"
                        htmlFor="custom2"
                        cursor="pointer"
                        fontSize="0.75rem"
                      >
                        {data?.customOption2Name}
                      </FormLabel>
                    </Flex>
                  ) : (
                    <></>
                  )}
                  {data?.customOption3State ? (
                    <Flex
                      align="center"
                      margin="0.25rem 0"
                      fontSize="0.75rem"
                      letterSpacing="-0.05rem"
                    >
                      <Checkbox
                        size="md"
                        id="custom3"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.custom3!)
                        }
                        borderRadius="0.5rem"
                        isChecked={userData.custom3 === false ? false : true}
                        variant="customBlue"
                      />
                      <FormLabel
                        fontWeight="500"
                        width="auto"
                        margin="0 0.5rem"
                        htmlFor="custom3"
                        cursor="pointer"
                        fontSize="0.75rem"
                      >
                        {data?.customOption3Name}
                      </FormLabel>
                    </Flex>
                  ) : (
                    <></>
                  )}
                </Flex>
              )}
              <Flex gap="1rem" margin="0.75rem 0">
                <Button
                  type="submit"
                  background="mainBlue"
                  fontSize="1rem"
                  color="#FFFFFF"
                  padding="0.5rem auto"
                  margin="0.5rem 0"
                  borderRadius="0.25rem"
                  width="100%"
                  isLoading={loadingState}
                  size="md"
                >
                  대기 등록
                </Button>
                <Button
                  type="button"
                  background="accentGray"
                  fontSize="1rem"
                  color="#FFFFFF"
                  padding="0.5rem auto"
                  margin="0.5rem 0"
                  borderRadius="0.25rem"
                  width="100%"
                  onClick={closeRegisterModal}
                  size="md"
                >
                  창 닫기
                </Button>
              </Flex>
            </FormControl>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdminRegisterModal;
