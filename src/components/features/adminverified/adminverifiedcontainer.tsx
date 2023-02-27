import { Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  confirmPasswordReset,
  getAuth,
  signInWithEmailLink,
  updatePassword,
  verifyPasswordResetCode,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { passwordRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

// 해야 할 작업
// 라우터를 받아와서 값이 resetEmail인지, emailverify인지 확인하기
// mode 여부에 따라 페이지 출력 여부를 다르게 할 것.

const AdminVerifiedContainer = () => {
  const initialState = new AdminData("", "", "");

  const [passwordData, setPasswordData] = useState<AdminData>(initialState);
  const [inputCheck, setInputCheck] = useState({
    password: false,
    passwordcheck: false,
  });
  const [changeState, setChangeState] = useState(false);

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

  const submitPasswordData = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      passwordData.password?.trim() === "" ||
      passwordData.passwordcheck?.trim() === ""
    ) {
      return alert("ㅁ");
    } else if (
      passwordData.password?.trim() !== passwordData.passwordcheck?.trim()
    ) {
      return alert("ㄴ");
    } else if (
      passwordRegex.test(passwordData.password!) === false ||
      passwordRegex.test(passwordData.passwordcheck!) === false
    ) {
      return alert("ㅇ");
    }

    resetPasswordMutation.mutate(passwordData);
  };

  // 내용 다시 수정해야함 -> 인증 후 5초 후에 로그인 페이지로 이동
  if (searchParams.get("mode") === "verifyEmail") {
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
          background="#5ABFB7"
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
  } else if (searchParams.get("mode") === "resetPassword") {
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
            <Heading as="h1" textAlign="center" marginBottom="2rem">
              웨잇세컨드
            </Heading>
            <Heading as="h2" fontSize="1.25rem">
              비밀번호 변경
            </Heading>
            <Text
              fontSize="1rem"
              lineHeight="1.5rem"
              whiteSpace="pre-wrap"
              textAlign="left"
              letterSpacing="-1px"
              margin="1rem 0"
            >
              새로 변경할 비밀번호를 입력해주세요.
            </Text>
            <form onSubmit={submitPasswordData}>
              <FormControl>
                <CommonInput
                  direction="column"
                  id="password"
                  title="비밀번호"
                  type="password"
                  value={passwordData.password!}
                  onChange={inputPasswordData}
                  margin="1.25rem 0 0 0 0"
                />
                <Text color="red" marginBottom="1.25rem">
                  {inputCheck.password === true
                    ? passwordData.password!.trim() === ""
                      ? "입력란을 빈칸으로 둘 수 없습니다."
                      : passwordRegex.test(passwordData.password!) === false
                      ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                      : "　"
                    : "　"}
                </Text>

                <CommonInput
                  direction="column"
                  id="passwordcheck"
                  title="비밀번호 확인"
                  type="password"
                  value={passwordData.passwordcheck!}
                  onChange={inputPasswordData}
                  margin="1.25rem 0 0 0"
                />
                <Text color="red" marginBottom="1.25rem">
                  {inputCheck.passwordcheck === true
                    ? passwordData.passwordcheck!.trim() === ""
                      ? "입력란을 빈칸으로 둘 수 없습니다."
                      : passwordRegex.test(passwordData.passwordcheck!) ===
                        false
                      ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                      : passwordData.password!.trim() !==
                        passwordData.passwordcheck!.trim()
                      ? "비밀번호가 일치하지 않습니다."
                      : "　"
                    : "　"}
                </Text>
                <Button
                  type="submit"
                  variant="solid"
                  background="#5ABFB7"
                  padding="0.5rem auto"
                  fontSize="1.25rem"
                  borderRadius="0.25rem"
                  color="#ffffff"
                  width="100%"
                  height="3rem"
                  marginTop="1rem"
                  onClick={submitPasswordData}
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
                로그인 페이지로 돌아가 변경하신 비밀번호로 로그인을 다시
                시도해주세요.
              </Text>
            </Flex>
            <Button
              type="submit"
              variant="solid"
              background="#5ABFB7"
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
  } else {
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
