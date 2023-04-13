import React, { useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  List,
  ListItem,
  Text,
  Link,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { AdminData, EventObject } from "../../../utils/typealies";
import { emailRegex, passwordRegex } from "../../../utils/reqlist";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CommonInput } from "../../common/commoninput";
import CommonErrorMsg from "../../common/commonerrormsg";
import { tokenExpirationCheck } from "../../../utils/verifiedcheck";
import { useMetaTag, useTitle } from "../../../utils/customhook";

const AdminWithdrawalContainer: React.FC = () => {
  useTitle("회원 탈퇴 ::: 웨잇세컨드");
  useMetaTag({
    title: "회원 탈퇴 ::: 웨잇세컨드",
  });
  const initialState = new AdminData("", "");
  const [userData, setUserData] = useState(initialState);
  const [withdrawalState, setWithdrawalState] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
  });
  const [loadingState, setLoadingState] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser;

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

  const withdrawalAccount = async (userData: AdminData) => {
    const credential = EmailAuthProvider.credential(
      userData!.email!,
      userData.password!
    );

    const withdrawalState = reauthenticateWithCredential(
      currentUser!,
      credential
    )
      .then(() =>
        deleteUser(currentUser!).then((data) => {
          return "delete-success";
        })
      )
      .catch((error) => error.message);
    return withdrawalState;
  };

  const withdrawalMutation = useMutation(withdrawalAccount, {
    onError: (error, variable) => console.log(error),
    onSuccess: (data, variable, context) => {
      setLoadingState(false);
      if (data === "delete-success") {
        return setWithdrawalState(true);
      }
      if (data.indexOf("user-not-found") !== -1) {
        return !toastMsg.isActive("error-userNotFound")
          ? toastMsg({
              title: "존재하지 않는 계정",
              id: "error-userNotFound",
              description:
                "해당 이메일로 가입한 아이디가 존재하지 않습니다. 이메일을 다시 확인해주세요. ",
              status: "error",
              duration: 5000,
              isClosable: true,
            })
          : null;
      }

      if (data.indexOf("wrong-password") !== -1) {
        return !toastMsg.isActive("error-wrongPassword")
          ? toastMsg({
              title: "잘못된 비밀번호",
              id: "error-wrongPassword",
              description:
                "해당 계정의 비밀번호가 일치하지 않습니다. 다시 시도해주세요.",
              status: "error",
              duration: 5000,
              isClosable: true,
            })
          : null;
      }

      if (data.indexOf("user-mismatch") !== -1) {
        return !toastMsg.isActive("error-userMismatch")
          ? toastMsg({
              title: "계정 불일치",
              id: "error-userMismatch",
              description:
                "현재 로그인한 계정과 정보가 일치하지 않습니다. 정보를 정확하게 입력해주세요.",
              status: "error",
              duration: 5000,
              isClosable: true,
            })
          : null;
      }
    },
  });

  const inputUserData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setUserData({ ...userData, [id]: value });

    if (e.target.id === "email" && inputCheck.email === false) {
      setInputCheck({ ...inputCheck, [id]: true });
    }

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, [id]: true });
    }
  };

  const toastMsg = useToast();

  const submitUserData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    if (userData.email.trim() === "" || userData.password?.trim() === "") {
      setLoadingState(false);
      return !toastMsg.isActive("error-blank")
        ? toastMsg({
            title: "입력란 확인",
            id: "error-blank",
            description: "이메일 아이디나 비밀번호를 빈칸으로 둘 수 없습니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    } else if (emailRegex.test(userData.email) === false) {
      setLoadingState(false);
      return !toastMsg.isActive("error-emailCheck")
        ? toastMsg({
            title: "이메일 확인",
            id: "error-emailCheck",
            description: "이메일을 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    } else if (userData.email !== currentUser?.email) {
      setLoadingState(false);
      return !toastMsg.isActive("error-emailIncorrect")
        ? toastMsg({
            title: "계정 불일치",
            id: "error-emailCheck",
            description:
              "현재 로그인하신 계정의 이메일과 입력하신 이메일 아이디가 동일하지 않습니다. 이메일을 정확하게 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    } else if (passwordRegex.test(userData.password!) === false) {
      setLoadingState(false);
      return !toastMsg.isActive("error-passwordCheck")
        ? toastMsg({
            title: "비밀번호 확인",
            id: "error-passwordCheck",
            description: "비밀번호를 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    withdrawalMutation.mutate(userData);
  };

  const closeRegisterModal = () => {
    setUserData(initialState);
    setInputCheck({
      email: false,
      password: false,
    });
    onClose();
    if (withdrawalState === true) {
      signOut(firebaseAuth)
        .then(() => navigate("/adminlogin"))
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeRegisterModal}>
        <ModalOverlay />
        <ModalContent margin="auto 1rem" padding="2rem 0" wordBreak="keep-all">
          {withdrawalState ? (
            <>
              <ModalHeader>이용해주셔서 감사합니다.</ModalHeader>
              <ModalBody>
                그 동안 웨잇세컨드를 이용해주셔서 감사합니다.
              </ModalBody>
              <ModalFooter>
                <Button onClick={closeRegisterModal}>닫기</Button>
              </ModalFooter>
            </>
          ) : (
            <ModalBody>
              <form onSubmit={submitUserData}>
                <FormControl>
                  <Text fontSize="1rem">
                    회원 탈퇴를 진행하기 위해 이용 중이신 이메일 아이디와
                    비밀번호를 입력해주세요.
                  </Text>
                  <Flex direction="column" padding="1.5rem 0 0.5rem 0">
                    <CommonInput
                      id="email"
                      title="이메일 아이디"
                      type="email"
                      value={userData.email!}
                      onChange={inputUserData}
                      margin="0.25rem 0"
                      fontSize="1rem"
                    />
                    <CommonErrorMsg
                      type="email"
                      value1={userData.email!}
                      inputCheck={inputCheck}
                      fontSize="0.75rem"
                    />
                    <CommonInput
                      id="password"
                      title="비밀번호"
                      type="password"
                      value={userData.password!}
                      onChange={inputUserData}
                      margin="0.25rem 0"
                      fontSize="1rem"
                      maxLength={20}
                    />
                    <CommonErrorMsg
                      type="password"
                      value1={userData.password!}
                      inputCheck={inputCheck}
                      fontSize="0.75rem"
                    />
                  </Flex>
                  <Flex direction="column">
                    <Button
                      type="submit"
                      background="mainBlue"
                      fontSize="1.25rem"
                      borderRadius="0.25rem"
                      color="#ffffff"
                      width="100%"
                      height="3rem"
                      margin="0.5rem 0"
                      isLoading={loadingState}
                    >
                      탈퇴 신청
                    </Button>
                    <Button
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      background="#8D8D8D"
                      padding="0.5rem auto"
                      fontSize="1.25rem"
                      fontWeight="semibold"
                      borderRadius="0.25rem"
                      color="#ffffff"
                      width="100%"
                      height="3rem"
                      margin="0.5rem 0"
                      onClick={onClose}
                      _hover={{
                        textDecoration: "none",
                        background: "#E2E8F0",
                      }}
                    >
                      이전으로
                    </Button>
                  </Flex>
                </FormControl>
              </form>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <Flex
        as="article"
        direction="column"
        border="none"
        padding="2rem 1.5rem"
        background="#FFFFFF"
        boxSizing="border-box"
        height="100vh"
        wordBreak="keep-all"
      >
        <Heading as="h1" fontSize="1.5rem" padding="1rem 0">
          회원 탈퇴
        </Heading>
        <Text fontSize="1rem">
          탈퇴 전, 아래의 내용을 읽어주시고 탈퇴를 희망하신다면 하단의 버튼을
          눌러주세요.
        </Text>
        <List
          display="flex"
          flexDirection="column"
          gap="1rem"
          fontSize="0.75rem"
          margin="1rem 0"
          wordBreak="keep-all"
        >
          <ListItem display="flex" flexDirection="row">
            <CheckCircleIcon color="green.500" margin="0.25rem 0.5rem" />
            <Text>
              회원 탈퇴를 진행하시면, 본 서비스를 이용하실 수 없게 되며 계정
              복구를 도와드리지 않습니다.
            </Text>
          </ListItem>
          <ListItem display="flex" flexDirection="row">
            <CheckCircleIcon color="green.500" margin="0.25rem 0.5rem" />
            <Text>
              탈퇴 시, 대기 예약을 위해 사용하신 QR 코드는 더 이상 사용하실 수
              없습니다.
            </Text>
          </ListItem>
          <ListItem display="flex" flexDirection="row">
            <CheckCircleIcon color="green.500" margin="0.25rem 0.5rem" />
            <Text>
              계정이 삭제되면서 같은 아이디로 재가입을 하셔도 본 서비스 이용
              시에 설정하신 사항은 모두 초기화됩니다.
            </Text>
          </ListItem>
        </List>
        <Button
          type="button"
          display="block"
          background="mainBlue"
          fontSize="1.25rem"
          borderRadius="0.25rem"
          color="#ffffff"
          width="100%"
          height="3rem"
          margin="3.5rem 0 0.5rem 0"
          onClick={onOpen}
        >
          동의합니다
        </Button>
        <Link
          display="flex"
          justifyContent="center"
          alignItems="center"
          background="#8D8D8D"
          padding="0.5rem auto"
          fontSize="1.25rem"
          fontWeight="semibold"
          borderRadius="0.25rem"
          color="#ffffff"
          width="100%"
          height="3rem"
          margin="0.5rem 0"
          as={ReactRouterLink}
          to="/adminsetting"
          _hover={{
            textDecoration: "none",
            background: "#E2E8F0",
          }}
        >
          이전으로
        </Link>
      </Flex>
    </>
  );
};

export default AdminWithdrawalContainer;
