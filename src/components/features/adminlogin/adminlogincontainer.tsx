import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailRegex, passwordRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";
import { Link as ReactRouterLink } from "react-router-dom";

const AdminLoginContainer = () => {
  const initialState = new AdminData("", "");

  const [loginData, setLoginData] = useState<AdminData>(initialState);
  const [autoLoginState, setAutoAgreeState] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  const firebaseAuth = getAuth();

  const loginAccount = async (userData: AdminData) => {
    const loginState = signInWithEmailAndPassword(
      firebaseAuth,
      userData.email,
      userData.password!
    )
      .then((cred) => console.log("로그인했습니다."))
      .catch((error) => console.log("로그인에 실패했습니다."));

    return loginState;
  };

  const loginMutation = useMutation(loginAccount, {
    onError: (error, variable) => console.log(error),
    onSuccess: (data, variable, context) => {
      console.log(data);
      // 회원 가입 완료하면 이메일 연동 페이지로 보내주기
    },
  });

  const inputLoginData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setLoginData({ ...loginData, [id]: value });

    if (e.target.id === "email" && inputCheck.email === false) {
      setInputCheck({ ...inputCheck, email: true });
    }

    if (e.target.id === "password" && inputCheck.password === false) {
      setInputCheck({ ...inputCheck, password: true });
    }
  };

  const submitLoginData = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email.trim() === "" || loginData.password?.trim() === "") {
      return alert("ㅁ");
    } else if (emailRegex.test(loginData.email) === false) {
      return alert("ㄴ");
    } else if (passwordRegex.test(loginData.password!) === false) {
      return alert("ㅇ");
    }

    loginMutation.mutate(loginData);
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
      <Heading as="h2" fontSize="1.25rem">
        관리자 로그인
      </Heading>
      <form onSubmit={submitLoginData}>
        <FormControl>
          <CommonInput
            direction="column"
            id="email"
            title="이메일 아이디"
            type="email"
            value={loginData.email}
            onChange={inputLoginData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1rem">
            {inputCheck.email === true
              ? loginData.email.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : emailRegex.test(loginData.email) === false
                ? "정확한 이메일을 입력해주십시오."
                : "　"
              : "　"}
          </Text>
          <CommonInput
            direction="column"
            id="password"
            title="비밀번호"
            type="password"
            value={loginData.password!}
            onChange={inputLoginData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck.password === true
              ? loginData.password!.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : passwordRegex.test(loginData.password!) === false
                ? "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다."
                : "　"
              : "　"}
          </Text>
          <Flex direction="row" justify="space-between" margin="0.75rem 0">
            <Flex direction="row">
              <Checkbox
                size="lg"
                id="autoLogin"
                onChange={() => setAutoAgreeState(!autoLoginState)}
                isChecked={autoLoginState ? true : false}
              ></Checkbox>
              <FormLabel htmlFor="autoLogin" margin="0 0.5rem" cursor="pointer">
                자동 로그인
              </FormLabel>
            </Flex>

            <Link as={ReactRouterLink} to="/adminfindpassword">
              비밀번호 찾기
            </Link>
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
            onClick={submitLoginData}
          >
            로그인
          </Button>
          <Button
            type="submit"
            variant="solid"
            background="#5A5A5A"
            padding="0.5rem auto"
            fontSize="1.25rem"
            borderRadius="0.25rem"
            color="#ffffff"
            width="100%"
            height="3rem"
            margin="1rem 0"
            onClick={() => navigate("/adminsignup")}
          >
            회원가입
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminLoginContainer;
