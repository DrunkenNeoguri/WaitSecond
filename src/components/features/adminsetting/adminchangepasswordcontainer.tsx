import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Link,
  useToast,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { AdminData, EventObject } from "../../../utils/typealies";
import { useMutation } from "@tanstack/react-query";
import { passwordRegex } from "../../../utils/reqlist";
import CommonErrorMsg from "../../common/commonerrormsg";
import { CommonInput } from "../../common/commoninput";

const AdminChangePasswordContainer: React.FC = () => {
  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser!;

  const initialState = new AdminData(currentUser.email!, "", "");
  const [userData, setUserData] = useState(initialState);
  const [inputCheck, setInputCheck] = useState({
    currentpassword: false,
    password: false,
    passwordcheck: false,
  });
  const [loadingState, setLoadingState] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const inputUserData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setUserData({ ...userData, [id]: value });

    if (
      e.target.id === "currentpassword" &&
      inputCheck.currentpassword === false
    ) {
      setInputCheck({ ...inputCheck, [id]: true });
    }

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, [id]: true });
    }

    if (e.target.id === "passwordcheck" && inputCheck.passwordcheck === false) {
      setInputCheck({ ...inputCheck, [id]: true });
    }
  };

  const toastMsg = useToast();

  const changePasswordAccount = async (userData: AdminData) => {
    const credential = EmailAuthProvider.credential(
      currentUser.email!,
      userData.currentpassword!
    );

    const withdrawalState = reauthenticateWithCredential(
      currentUser,
      credential
    )
      .then(() =>
        updatePassword(currentUser, userData.password!).then(
          () => "change-success"
        )
      )
      .catch((error) => error.message);
    return withdrawalState;
  };

  const changePasswordMutation = useMutation(changePasswordAccount, {
    onError: (error, variable) => console.log(error),
    onSuccess: (data, variable, context) => {
      setLoadingState(false);
      if (data === "change-success") {
        onOpen();
      } else {
        if (data.indexOf("email-already-in-use") !== -1) {
          return !toastMsg.isActive("error-duplicate")
            ? toastMsg({
                title: "중복된 계정",
                id: "error-duplicate",
                description:
                  "이미 해당 이메일로 가입하신 계정이 있습니다. 로그인 페이지로 돌아가 로그인을 다시 시도해보세요.",
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            : null;
        }
      }
    },
  });

  const submitUserData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);

    if (
      userData.password?.trim() === "" ||
      userData.passwordcheck?.trim() === "" ||
      userData.currentpassword?.trim() === ""
    ) {
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
    } else if (userData.password?.trim() !== userData.passwordcheck?.trim()) {
      setLoadingState(false);
      return !toastMsg.isActive("error-passwordDiscord")
        ? toastMsg({
            title: "비밀번호 불일치",
            id: "error-passwordDiscord",
            description:
              "비밀번호와 비밀번호 확인란의 내용이 서로 일치하지 않습니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    } else if (
      !passwordRegex.test(userData.password!) ||
      !passwordRegex.test(userData.passwordcheck!) ||
      !passwordRegex.test(userData.currentpassword!)
    ) {
      setLoadingState(false);
      return !toastMsg.isActive("error-passwordCheck")
        ? toastMsg({
            title: "비밀번호 확인",
            id: "error-passwordCheck",
            description:
              "비밀번호를 양식에 맞게 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    changePasswordMutation.mutate(userData);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>비밀번호 변경 완료</ModalHeader>
          <ModalBody>정상적으로 비밀번호가 변경됐습니다.</ModalBody>

          <ModalFooter>
            <Button onClick={() => navigate("/adminsetting")}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex
        as="article"
        direction="column"
        border="none"
        borderRadius="1rem 1rem 0 0"
        boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        padding="4.5rem 1.5rem"
        background="#FFFFFF"
        boxSizing="border-box"
        height="100vh"
      >
        <Heading as="h1" fontSize="1.5rem" padding="1rem 0">
          비밀번호 변경
        </Heading>
        <Text fontSize="0.75rem">새로 변경할 비밀번호를 입력해주세요.</Text>
        <form onSubmit={submitUserData}>
          <FormControl padding="1.5rem 0">
            <Flex direction="column" padding="0.25rem 0">
              <CommonInput
                id="currentpassword"
                title="기존 비밀번호"
                type="password"
                value={userData.currentpassword!}
                onChange={inputUserData}
                margin="0.25rem 0"
                fontSize="1rem"
              />
              <CommonErrorMsg
                type="password"
                value1={userData.currentpassword!}
                inputCheck={inputCheck}
              />
            </Flex>
            <Flex direction="column" padding="0.25rem 0">
              <CommonInput
                id="password"
                title="새 비밀번호"
                type="password"
                value={userData.password!}
                onChange={inputUserData}
                margin="0.25rem 0"
                fontSize="1rem"
              />
              <CommonErrorMsg
                type="password"
                value1={userData.password!}
                inputCheck={inputCheck}
              />
            </Flex>
            <Flex direction="column" padding="0.25rem 0">
              <CommonInput
                id="passwordcheck"
                title="새 비밀번호 확인"
                type="password"
                value={userData.passwordcheck!}
                onChange={inputUserData}
                margin="0.25rem 0"
                fontSize="1rem"
              />
              <CommonErrorMsg
                type="password"
                value1={userData.passwordcheck!}
                inputCheck={inputCheck}
              />
            </Flex>

            <Flex direction="column" margin="0.5rem 0 1.5rem 0">
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
                margin="0.5rem 0"
                isLoading={loadingState}
              >
                비밀번호 변경
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
          </FormControl>
        </form>
      </Flex>
    </>
  );
};

export default AdminChangePasswordContainer;
