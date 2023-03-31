import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { emailRegex, passwordRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";
import { Link as ReactRouterLink } from "react-router-dom";
import CommonErrorMsg from "../../common/commonerrormsg";
import { firebaseConfig } from "../../../utils/firestore.setting";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const AdminLoginContainer = () => {
  const initialState = new AdminData(
    localStorage.getItem("email") === null
      ? ""
      : localStorage.getItem("email")!,
    ""
  );

  const [loginData, setLoginData] = useState<AdminData>(initialState);
  const [saveEmailState, setSaveEmailState] = useState(
    localStorage.getItem("saveEmail") === null ||
      localStorage.getItem("saveEmail") === "false"
      ? false
      : true
  );
  const [isVerified, setIsVerified] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    email: false,
    password: false,
  });
  const [loadingState, setLoadingState] = useState(false);

  const navigate = useNavigate();
  const firebaseAuth = getAuth();

  const [check, setCheck] = useState(false);
  const [firstSet, setFirstSet] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (check === true) {
      const db = getFirestore();
      const sessionKey = `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`;
      const loginState = JSON.parse(sessionStorage.getItem(sessionKey)!);
      getDocs(collection(db, "adminList"))
        .then((data) => {
          let userData: any;
          data.forEach((doc) => {
            if (doc.data().uid === loginState.uid) {
              if (doc.data().firstSetting === false) {
                userData = { data: doc.data(), uid: doc.id };
              } else if (doc.data().firstSetting === true) {
                setLoadingState(false);
                return navigate("/adminwaitinglist");
              }
            }
          });
          return userData;
        })
        .then((data) => {
          const receiveData = data.data;
          setDoc(doc(db, "adminList", `${data.uid}`), {
            ...receiveData,
            firstSetting: true,
          }).then(() => {
            setCheck(false);
            setFirstSet(true);
          });
        });
    }
  }, [check]);

  const loginAccount = async (userData: AdminData) => {
    const loginState = setPersistence(firebaseAuth, browserSessionPersistence)
      .then(() =>
        signInWithEmailAndPassword(
          firebaseAuth,
          userData.email,
          userData.password!
        )
      )
      .then((cred) => {
        if (cred.user.emailVerified === false) {
          sendEmailVerification(cred.user);
          return "send-email";
        } else {
          onAuthStateChanged(firebaseAuth, () => {});
          return "login-success";
        }
      })
      .catch((error) => error.message);

    return loginState;
  };

  const loginMutation = useMutation(loginAccount, {
    onError: (error, variable) => console.log(error),
    onSuccess: (data, variable, context) => {
      if (data === "login-success") {
        if (saveEmailState === true) {
          localStorage.setItem("saveEmail", "true");
          localStorage.setItem("email", loginData.email);
        } else if (saveEmailState === false) {
          localStorage.clear();
        }
        setCheck(true);
        // return navigate("/adminwaitinglist");
      } else {
        setLoadingState(false);
        if (data.indexOf("send-email") !== -1) {
          setIsVerified(true);
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

        if (data.indexOf("user-disabled") !== -1) {
          return !toastMsg.isActive("error-userDisabled")
            ? toastMsg({
                title: "탈퇴한 계정",
                id: "error-duplicate",
                description:
                  "해당 이메일로 가입된 계정은 탈퇴되어 더 이상 이용하실 수 없습니다.",
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            : null;
        }

        if (data.indexOf("too-many-requests") !== -1) {
          return !toastMsg.isActive("error-tooManyRequest")
            ? toastMsg({
                title: "로그인 시도 횟수 초과",
                id: "error-tooManyRequest",
                description:
                  "로그인 시도 횟수를 초과하셨습니다. 잠시 후, 다시 시도해주세요.",
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            : null;
        }
      }
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

  const toastMsg = useToast();
  const submitLoginData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    if (loginData.email.trim() === "" || loginData.password?.trim() === "") {
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
    } else if (emailRegex.test(loginData.email) === false) {
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
    } else if (passwordRegex.test(loginData.password!) === false) {
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

    loginMutation.mutate(loginData);
  };

  const moveToStoreSettingPage = () => {
    onClose();
    navigate("/adminstoremanage");
  };
  return (
    <>
      <Modal isOpen={firstSet} onClose={moveToStoreSettingPage}>
        <ModalOverlay />
        <ModalContent margin="auto 1rem" padding="1rem 0" wordBreak="keep-all">
          <ModalHeader
            fontSize="1.25rem"
            fontWeight="semibold"
            padding="1rem 1.5rem"
          >
            매장 초기 세팅 안내
          </ModalHeader>
          <ModalBody display="flex" flexDirection="column">
            첫 로그인을 환영합니다.
            <br />
            <br />
            대기 접수를 받으시기 전에, 매장을 방문하고 대기해주실 고객분들을
            위해 대기 접수 설정을 변경해주세요.
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              background="mainBlue"
              fontSize="1rem"
              color="#FFFFFF"
              padding="0.5rem auto"
              margin="0.5rem 0"
              borderRadius="0.25rem"
              width="100%"
              onClick={moveToStoreSettingPage}
              size="md"
            >
              매장 관리 화면으로 이동
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
        <Heading as="h1" textAlign="center">
          웨잇세컨드
        </Heading>
        <Heading as="h2" fontSize="1.25rem" padding="2rem 0">
          {isVerified ? "계정 인증 이메일 전송 안내" : "관리자 로그인"}
        </Heading>
        {isVerified ? (
          <>
            <Flex
              direction="column"
              fontSize="1rem"
              lineHeight="1.5rem"
              wordBreak="keep-all"
              textAlign="left"
              letterSpacing="-1px"
              margin="1rem 0"
              gap="1rem"
            >
              입력하신 이메일 아이디로 계정 인증을 위한 메일을 보내드렸습니다.
              <br />
              <br />
              받으신 이메일 속의 링크를 눌러 인증을 진행해주세요.
              <br />
              <br />
              해당 페이지는 이제 닫으셔도 괜찮습니다.
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
              onClick={() => setIsVerified(false)}
            >
              로그인 페이지로 이동
            </Button>
          </>
        ) : (
          <form onSubmit={submitLoginData}>
            <FormControl>
              <CommonInput
                id="email"
                title="이메일 아이디"
                type="email"
                value={loginData.email!}
                onChange={inputLoginData}
                margin="0.25rem 0"
                fontSize="1rem"
              />
              <CommonErrorMsg
                type="email"
                value1={loginData.email!}
                inputCheck={inputCheck}
              />
              <CommonInput
                id="password"
                title="비밀번호"
                type="password"
                value={loginData.password!}
                onChange={inputLoginData}
                margin="0.25rem 0"
                fontSize="1rem"
              />
              <CommonErrorMsg
                type="password"
                value1={loginData.password!}
                inputCheck={inputCheck}
              />
              <Flex direction="row" justify="space-between" margin="0.75rem 0">
                <Flex direction="row">
                  <Checkbox
                    size="md"
                    id="autoLogin"
                    onChange={() => setSaveEmailState(!saveEmailState)}
                    isChecked={saveEmailState ? true : false}
                  ></Checkbox>
                  <FormLabel
                    htmlFor="autoLogin"
                    margin="0 0.5rem"
                    cursor="pointer"
                  >
                    이메일 저장
                  </FormLabel>
                </Flex>

                <Link as={ReactRouterLink} to="/adminfindpassword">
                  비밀번호 찾기
                </Link>
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
                onClick={submitLoginData}
                isLoading={loadingState}
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
                margin="0.5 01rem 0"
                onClick={() => navigate("/adminsignup")}
              >
                회원가입
              </Button>
            </FormControl>
          </form>
        )}
      </Flex>
    </>
  );
};

export default AdminLoginContainer;
