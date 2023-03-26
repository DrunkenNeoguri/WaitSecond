import React, { useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
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
import { useMutation } from "@tanstack/react-query";
import { CommonInput } from "../../common/commoninput";
import CommonErrorMsg from "../../common/commonerrormsg";

const AdminWithdrawalContainer: React.FC = () => {
  const initialState = new AdminData("", "");
  const [userData, setUserData] = useState(initialState);
  const [withdrawalState, setWithdrawalState] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser;

  const withdrawalAccount = async (userData: AdminData) => {
    const credential = EmailAuthProvider.credential(
      currentUser!.email!,
      userData.password!
    );

    const withdrawalState = reauthenticateWithCredential(
      currentUser!,
      credential
    )
      .then(() => deleteUser(currentUser!).then(() => "delete-success"))
      .catch((error) => error.message);
    return withdrawalState;
  };

  const withdrawalMutation = useMutation(withdrawalAccount, {
    onError: (error, variable) => console.log(error),
    onSuccess: (data, variable, context) => {
      setWithdrawalState(true);
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

    if (userData.email.trim() === "" || userData.password?.trim() === "") {
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
    } else if (passwordRegex.test(userData.password!) === false) {
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

  const returnToLoginPage = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut(firebaseAuth)
      .then(() => navigate("/adminlogin"))
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto" padding="2rem 0" wordBreak="keep-all">
          {withdrawalState ? (
            <>
              <ModalHeader>이용해주셔서 감사합니다.</ModalHeader>
              <ModalBody>
                그 동안 웨잇세컨드를 이용해주셔서 감사합니다.
              </ModalBody>
              <ModalFooter>
                <Button onClick={returnToLoginPage}>닫기</Button>
              </ModalFooter>
            </>
          ) : (
            <ModalBody>
              <form onSubmit={submitUserData}>
                <FormControl>
                  <Text fontSize="1rem">
                    회원 탈퇴를 위해 이용 중이신 이메일 아이디와 비밀번호를
                    입력해주십시오.
                  </Text>
                  <Flex direction="column" padding="1.5rem 0 0.5rem 0">
                    <CommonInput
                      id="email"
                      title="이메일"
                      type="email"
                      value={userData.email!}
                      onChange={inputUserData}
                      margin="0.25rem 0"
                      fontSize="1rem"
                    />
                    <CommonErrorMsg
                      type="password"
                      value1={userData.email!}
                      inputCheck={inputCheck}
                    />
                    <CommonInput
                      id="password"
                      title="비밀번호"
                      type="password"
                      value={userData.password!}
                      onChange={inputUserData}
                      margin="0.25rem 0"
                      fontSize="1rem"
                    />
                    <CommonErrorMsg
                      type="password"
                      value1={userData.email!}
                      inputCheck={inputCheck}
                    />
                  </Flex>
                  <Flex direction="column">
                    <Button
                      type="submit"
                      background="subBlue"
                      fontSize="1.25rem"
                      borderRadius="0.25rem"
                      color="#ffffff"
                      width="100%"
                      height="3rem"
                      margin="0.5rem 0"
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
        borderRadius="1rem 1rem 0 0"
        boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        padding="4.5rem 1.5rem 0 1.5rem"
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
          background="subBlue"
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
