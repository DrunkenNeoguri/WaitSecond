import {
  Button,
  Flex,
  FormControl,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  applyActionCode,
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { passwordRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import CommonErrorMsg from "../../common/commonerrormsg";
import { CommonInput } from "../../common/commoninput";

const AdminVerifiedContainer = () => {
  const initialState = new AdminData("", "", "");

  const [passwordData, setPasswordData] = useState<AdminData>(initialState);
  const [inputCheck, setInputCheck] = useState({
    password: false,
    passwordcheck: false,
  });
  const [changeState, setChangeState] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const [searchParams] = useSearchParams();

  const firebaseAuth = getAuth();
  const actionCode = searchParams.get("oobCode");
  const navigate = useNavigate();

  const resetPasswordAccount = async (userData: AdminData) => {
    const resetPasswordState = verifyPasswordResetCode(
      firebaseAuth,
      actionCode!
    )
      .then((data) =>
        confirmPasswordReset(firebaseAuth, actionCode!, userData.password!)
      )
      .then((data) => "")
      .catch((error) => error.message);
    return resetPasswordState;
  };

  const resetPasswordMutation = useMutation(resetPasswordAccount, {
    onSuccess: (data) => {
      setLoadingState(false);
      setChangeState(true);
    },
    onError: (error) => console.log(error),
  });

  const inputPasswordData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setPasswordData({ ...passwordData, [id]: value });

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, password: true });
    }

    if (e.target.id === "passwordcheck" && inputCheck.passwordcheck === false) {
      setInputCheck({ ...inputCheck, passwordcheck: true });
    }
  };

  const toastMsg = useToast();

  const submitPasswordData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    if (
      passwordData.password?.trim() === "" ||
      passwordData.passwordcheck?.trim() === ""
    ) {
      setLoadingState(false);
      return !toastMsg.isActive("error-blank")
        ? toastMsg({
            title: "입력란 확인",
            id: "error-blank",
            description:
              "비밀번호와 비밀번호 확인란을 빈칸으로 둘 수 없습니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    } else if (
      passwordData.password?.trim() !== passwordData.passwordcheck?.trim()
    ) {
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
      passwordRegex.test(passwordData.password!) === false ||
      passwordRegex.test(passwordData.passwordcheck!) === false
    ) {
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

    resetPasswordMutation.mutate(passwordData);
  };

  if (searchParams.get("mode") === "verifyEmail") {
    if (actionCode !== null) {
      applyActionCode(firebaseAuth, actionCode);
    }
  }

  // 내용 다시 수정해야함 -> 인증 후 5초 후에 로그인 페이지로 이동
  switch (searchParams.get("mode")) {
    case "verifyEmail":
      return (
        <Flex
          as="section"
          direction="column"
          position="relative"
          background="#ffffff"
          padding="2rem 1.5rem"
          margin="0 1rem"
          border="none"
          borderRadius="1rem"
          top="5.5rem"
          boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        >
          <Heading as="h1" textAlign="center" marginBottom="2rem">
            웨잇세컨드
          </Heading>
          <Heading as="h2" fontSize="1.25rem">
            이메일 인증
          </Heading>
          <Flex
            direction="column"
            fontSize="1rem"
            lineHeight="1.5rem"
            whiteSpace="pre-wrap"
            textAlign="left"
            letterSpacing="-1px"
            margin="1rem 0"
            gap="1rem"
          >
            <Text>
              이메일 인증이 완료됐습니다. <br />
              로그인 페이지로 돌아가 가입하신 계정으로 로그인을 시도해주세요.
            </Text>
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
            onClick={() => navigate("/adminlogin")}
          >
            로그인 페이지로 이동
          </Button>
        </Flex>
      );
    case "resetPassword":
      return (
        <Flex
          as="section"
          direction="column"
          position="relative"
          background="#ffffff"
          padding="2rem 1.5rem"
          margin="0 1rem"
          border="none"
          borderRadius="1rem"
          top="5.5rem"
          boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        >
          {!changeState ? (
            <>
              <Heading as="h1" textAlign="center">
                웨잇세컨드
              </Heading>
              <Heading as="h1" fontSize="1.5rem" padding="1rem 0">
                비밀번호 변경
              </Heading>
              <Text fontSize="1rem">새로 등록할 비밀번호를 입력해주세요.</Text>
              <form onSubmit={submitPasswordData}>
                <FormControl>
                  <Flex direction="column" margin="1.5rem 0 1rem 0">
                    <CommonInput
                      id="password"
                      title="비밀번호"
                      type="password"
                      value={passwordData.password!}
                      onChange={inputPasswordData}
                      margin="0.25rem 0"
                    />
                    <CommonErrorMsg
                      type="password"
                      value1={passwordData.password!}
                      inputCheck={inputCheck}
                    />
                  </Flex>
                  <Flex direction="column" margin="1rem 0 0.5rem 0">
                    <CommonInput
                      id="passwordcheck"
                      title="비밀번호 확인"
                      type="password"
                      value={passwordData.passwordcheck!}
                      onChange={inputPasswordData}
                      margin="0.25rem 0 0 0"
                    />
                    <CommonErrorMsg
                      type="passwordcheck"
                      value1={passwordData.passwordcheck!}
                      value2={passwordData.password!}
                      inputCheck={inputCheck}
                    />
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
                    marginTop="1rem"
                    onClick={submitPasswordData}
                    isLoading={loadingState}
                  >
                    비밀번호 변경
                  </Button>
                </FormControl>
              </form>{" "}
            </>
          ) : (
            <>
              <Heading as="h1" textAlign="center" marginBottom="2rem">
                웨잇세컨드
              </Heading>
              <Heading as="h2" fontSize="1.25rem">
                비밀번호 변경 완료
              </Heading>
              <Flex
                direction="column"
                fontSize="1rem"
                lineHeight="1.5rem"
                whiteSpace="pre-wrap"
                textAlign="left"
                letterSpacing="-1px"
                margin="1rem 0"
                gap="1rem"
              >
                <Text>
                  비밀번호가 변경됐습니다.
                  <br />
                  <br />
                  로그인 페이지로 돌아가 변경하신 비밀번호로 로그인을 다시
                  시도해주세요.
                </Text>
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
                onClick={() => navigate("/adminlogin")}
              >
                로그인 페이지로 이동
              </Button>
            </>
          )}
        </Flex>
      );
    default:
      return (
        <Flex
          as="section"
          direction="column"
          position="relative"
          background="#ffffff"
          padding="2rem 1.5rem"
          margin="0 1rem"
          border="none"
          borderRadius="1rem"
          top="5.5rem"
          boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
        >
          <Heading as="h1" textAlign="center" marginBottom="2rem">
            웨잇세컨드
          </Heading>
          <Heading as="h2" fontSize="1.25rem">
            잘못된 접근입니다.
          </Heading>
          <Flex
            direction="column"
            fontSize="1rem"
            lineHeight="1.5rem"
            whiteSpace="pre-wrap"
            textAlign="left"
            letterSpacing="-1px"
            margin="1rem 0"
            gap="1rem"
          >
            <Text>5초 후 로그인 페이지로 이동합니다.</Text>
          </Flex>
        </Flex>
      );
  }
};

export default AdminVerifiedContainer;
