import { Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { CommonInput } from "../../common/commoninput";
import { AdminData, EventObject } from "../../../utils/typealies";
import { emailRegex, passwordRegex } from "../../../utils/reqlist";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const AdminSignUpContainer: React.FC = () => {
  const initialState = new AdminData("", "", "");

  const [signUpData, setSignUpData] = useState<AdminData>(initialState);
  const [signUpState, setSignUpState] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
    passwordcheck: false,
  });
  const navigate = useNavigate();

  const firebaseAuth = getAuth();

  const signUpAccount = async (userData: AdminData) => {
    const createState = createUserWithEmailAndPassword(
      firebaseAuth,
      userData.email,
      userData.password!
    )
      .then((cred) => sendEmailVerification(cred.user).then(() => true))
      .catch((error) => error.message);
    return createState;
  };

  const signupMutation = useMutation(signUpAccount, {
    onError: (error, variable) => console.log(error, variable),
    onSuccess: (data, variable, context) => {
      // Firebase auth에서 catch를 통해 받은 error Message도 onSuccess로 들어온다.
      if (typeof data === "string") {
        const errorType = data.substring(22, data.length - 2);
        if (errorType === "email-already-in-use") {
          // toast 메시지 띄워줄것 - 이미 존재하는 이메일 주소입니다.
        }
      } else if (typeof data === "boolean" && data === true) {
        setSignUpState(true);
        // 회원 가입 완료하면 이메일 연동 페이지로 보내주기
      }
    },
  });

  const inputSignUpData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setSignUpData({ ...signUpData, [id]: value });

    if (e.target.id === "email" && inputCheck.email === false) {
      setInputCheck({ ...inputCheck, email: true });
    }

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, password: true });
    }

    if (e.target.id === "passwordcheck" && inputCheck.passwordcheck === false) {
      setInputCheck({ ...inputCheck, passwordcheck: true });
    }
  };

  const submitSignUpData = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      signUpData.email.trim() === "" ||
      signUpData.password?.trim() === "" ||
      signUpData.passwordcheck?.trim() === ""
    ) {
      return alert("ㅁ");
    } else if (emailRegex.test(signUpData.email) === false) {
      return alert("ㄴ");
    } else if (
      passwordRegex.test(signUpData.password!) === false ||
      passwordRegex.test(signUpData.passwordcheck!) === false
    ) {
      return alert("ㅇ");
    } else if (signUpData.password! !== signUpData.passwordcheck!) {
      return alert("ㄹ");
    }

    signupMutation.mutate(signUpData);
  };

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
      {!signUpState ? (
        <>
          <Heading as="h2" fontSize="1.25rem">
            회원가입
          </Heading>
          <form onSubmit={submitSignUpData}>
            <FormControl>
              <CommonInput
                direction="column"
                id="email"
                title="이메일 아이디"
                type="email"
                value={signUpData.email}
                onChange={inputSignUpData}
                margin="1.25rem 0 0 0"
              />
              <Text color="red" marginBottom="1.25rem">
                {inputCheck.email === true
                  ? signUpData.email.trim() === ""
                    ? "입력란을 빈칸으로 둘 수 없습니다."
                    : emailRegex.test(signUpData.email) === false
                    ? "정확한 이메일을 입력해주십시오."
                    : "　"
                  : "　"}
              </Text>

              <CommonInput
                direction="column"
                id="password"
                title="비밀번호"
                type="password"
                value={signUpData.password!}
                onChange={inputSignUpData}
                margin="1.25rem 0 0 0"
              />
              <Text color="red" marginBottom="1.25rem">
                {inputCheck.password === true
                  ? signUpData.password!.trim() === ""
                    ? "입력란을 빈칸으로 둘 수 없습니다."
                    : passwordRegex.test(signUpData.password!) === false
                    ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                    : "　"
                  : "　"}
              </Text>

              <CommonInput
                direction="column"
                id="passwordcheck"
                title="비밀번호 확인"
                type="password"
                value={signUpData.passwordcheck!}
                onChange={inputSignUpData}
                margin="1.25rem 0 0 0"
              />
              <Text color="red" marginBottom="1.25rem">
                {inputCheck.passwordcheck === true
                  ? signUpData.passwordcheck!.trim() === ""
                    ? "입력란을 빈칸으로 둘 수 없습니다."
                    : passwordRegex.test(signUpData.passwordcheck!) === false
                    ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                    : signUpData.password!.trim() !==
                      signUpData.passwordcheck!.trim()
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
                onClick={submitSignUpData}
              >
                다음으로
              </Button>
            </FormControl>
          </form>
        </>
      ) : (
        <>
          <Heading as="h2" fontSize="1.25rem">
            계정 인증 이메일 전송 안내
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
              입력하신 이메일 아이디로 계정 인증을 위한 메일을 보내드렸습니다.
              <br />
              이메일에서 받으신 이메일 속 링크를 눌러 인증을 진행해주세요.
              <br />
              해당 페이지는 이제 닫으셔도 괜찮습니다.
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
};

export default AdminSignUpContainer;
