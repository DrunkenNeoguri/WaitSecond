import {
  Flex,
  Heading,
  FormControl,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { emailRegex } from "../../../utils/reqlist";
import { AdminData, EventObject } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";

const AdminFindPasswordContainer = () => {
  const initialState = new AdminData("");

  const [emailData, setEmailData] = useState<AdminData>(initialState);
  const [inputCheck, setInputCheck] = useState(false);

  const firebaseAuth = getAuth();

  const findPasswordAccount = async (userData: AdminData) => {
    const findPasswordState = sendPasswordResetEmail(
      firebaseAuth,
      userData.email
    )
      .then((data) => data)
      .catch((error) => error.message);
    return findPasswordState;
  };

  const findPasswordMutation = useMutation(findPasswordAccount, {
    onError: (error, variable) => console.log(error, variable),
    onSuccess: (data, variable, context) => {
      console.log(data);
    },
  });

  const inputEmailData = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setEmailData({ ...emailData, [id]: value });
    if (inputCheck === false) {
      setInputCheck(true);
    }
  };

  const toastMsg = useToast();

  const submitEmailData = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      emailData.email.trim() === "" ||
      emailRegex.test(emailData.email) === false
    ) {
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
        비밀번호 찾기
      </Heading>
      <Text
        fontSize="1rem"
        lineHeight="1.5rem"
        whiteSpace="pre-wrap"
        textAlign="left"
        letterSpacing="-1px"
        margin="1rem 0"
      >
        등록하신 이메일 주소를 입력해주세요.
      </Text>
      <form onSubmit={submitEmailData}>
        <FormControl>
          <CommonInput
            direction="column"
            id="email"
            title="가입한 이메일 주소"
            type="email"
            value={emailData.email}
            onChange={inputEmailData}
            margin="1.25rem 0 0 0"
          />
          <Text color="red" marginBottom="1.25rem">
            {inputCheck === true
              ? emailData.email.trim() === ""
                ? "입력란을 빈칸으로 둘 수 없습니다."
                : emailRegex.test(emailData.email) === false
                ? "정확한 이메일을 입력해주십시오."
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
            margin="1rem 0"
            onClick={submitEmailData}
          >
            이메일 전송
          </Button>
        </FormControl>
      </form>
    </Flex>
  );
};

export default AdminFindPasswordContainer;
