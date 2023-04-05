import {
  Flex,
  Heading,
  FormControl,
  Button,
  Text,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "../../../utils/reqlist";
import { EventObject } from "../../../utils/typealies";
import CommonErrorMsg from "../../common/commonerrormsg";
import { CommonInput } from "../../common/commoninput";
import { useMetaTag, useTitle } from "../../../utils/customhook";

const AdminFindPasswordContainer = () => {
  useTitle("비밀번호 찾기 ::: 웨잇세컨드");
  useMetaTag({
    title: "비밀번호 찾기 ::: 웨잇세컨드",
  });
  const [emailData, setEmailData] = useState("");
  const [inputCheck, setInputCheck] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [sendState, setSendState] = useState(false);

  const navigate = useNavigate();
  const firebaseAuth = getAuth();

  const findPasswordAccount = async (emailData: string) => {
    const findPasswordState = sendPasswordResetEmail(firebaseAuth, emailData)
      .then((data) => "send-email-success")
      .catch((error) => error.message);
    return findPasswordState;
  };

  const findPasswordMutation = useMutation(findPasswordAccount, {
    onError: (error, variable) => console.log(error, variable),
    onSuccess: (data, variable, context) => {
      setLoadingState(false);
      setSendState(true);

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
    },
  });

  const inputEmailData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { value }: EventObject = e.currentTarget;
    setEmailData(value!);

    if (inputCheck === false) {
      setInputCheck(true);
    }
  };

  const toastMsg = useToast();

  const submitEmailData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    if (emailData.trim() === "" || emailRegex.test(emailData) === false) {
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
    }

    findPasswordMutation.mutate(emailData);
  };

  return (
    <Box as="article" padding="2rem 0">
      <Flex
        direction="column"
        background="#ffffff"
        padding="2rem 1.5rem"
        margin="0 1rem"
        borderRadius="1rem"
        boxShadow="0px 4px 6px rgba(90, 90, 90, 30%)"
      >
        <Heading as="h1" textAlign="center">
          웨잇세컨드
        </Heading>

        {sendState ? (
          <>
            <Heading as="h2" fontSize="1.25rem" padding="2rem 0 1rem 0">
              이메일 전송 안내
            </Heading>
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
              입력하신 이메일 아이디로 새로 비밀번호를 변경하기 위한 메일을
              보내드렸습니다.
              <br />
              <br />
              받으신 이메일 속의 링크를 눌러 절차를 진행해주세요.
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
              onClick={() => navigate("/adminlogin")}
            >
              로그인 페이지로 이동
            </Button>
          </>
        ) : (
          <>
            <Heading as="h2" fontSize="1.25rem" padding="2rem 0">
              비밀번호 찾기
            </Heading>
            <Text fontSize="1rem">가입하신 이메일 아이디를 입력해주세요.</Text>
            <form onSubmit={submitEmailData}>
              <FormControl>
                <Flex direction="column" margin="1.5rem 0 0.5rem 0">
                  <CommonInput
                    id="email"
                    title="가입하신 이메일 아이디"
                    type="email"
                    value={emailData}
                    onChange={inputEmailData}
                    margin="0.25rem 0"
                  />
                  <CommonErrorMsg
                    type="email"
                    value1={emailData}
                    inputCheck={{ email: inputCheck }}
                    fontSize="0.75rem"
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
                  margin="1rem 0"
                  onClick={submitEmailData}
                  isLoading={loadingState}
                >
                  이메일 전송
                </Button>
              </FormControl>
            </form>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default AdminFindPasswordContainer;
