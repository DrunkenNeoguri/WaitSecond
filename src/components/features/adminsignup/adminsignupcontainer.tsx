import {
  Button,
  Flex,
  FormControl,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { CommonInput } from "../../common/commoninput";
import { AdminData, EventObject, StoreOption } from "../../../utils/typealies";
import { emailRegex, passwordRegex } from "../../../utils/reqlist";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const AdminSignUpContainer: React.FC = () => {
  const initialState = new AdminData("", "", "");

  const navigate = useNavigate();
  const toastMsg = useToast();
  const [signUpData, setSignUpData] = useState<AdminData>(initialState);
  const [signUpState, setSignUpState] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
    passwordcheck: false,
  });

  const firebaseAuth = getAuth();
  const db = getFirestore();
  const adminList = collection(db, "adminList");

  const signUpAccount = async (userData: AdminData) => {
    const createState = createUserWithEmailAndPassword(
      firebaseAuth,
      userData.email,
      userData.password!
    )
      .then((cred) => {
        sendEmailVerification(cred.user);
        return cred.user.uid;
      })
      .then((uid) => {
        const adminData: StoreOption = {
          uid: uid,
          storeName: "",
          storebg: "",
          waitingState: false,
          maximumTeamMemberCount: 4,
          maximumWaitingTeamCount: 10,
          petAllow: false,
          teamSeparate: false,
          customOption1Name: "",
          customOption1State: false,
          customOption2Name: "",
          customOption2State: false,
          customOption3Name: "",
          customOption3State: false,
        };
        addDoc(adminList, adminData);
        return uid;
      })
      .then(() => "signup-success")
      .catch((error) => error.message);
    return createState;
  };

  const signupMutation = useMutation(signUpAccount, {
    onError: (error, variable) => console.log(error, variable),
    onSuccess: (data, variable, context) => {
      // Firebase auth에서 catch를 통해 받은 error Message도 onSuccess로 들어온다.
      if (data === "signup-success") {
        setSignUpState(true);
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
    } else if (emailRegex.test(signUpData.email) === false) {
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
    } else if (
      passwordRegex.test(signUpData.password!) === false ||
      passwordRegex.test(signUpData.passwordcheck!) === false
    ) {
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
    } else if (signUpData.password! !== signUpData.passwordcheck!) {
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
