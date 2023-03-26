import { Text } from "@chakra-ui/react";
import { emailRegex, passwordRegex } from "../../utils/reqlist";

const CommonErrorMsg: React.FC<{
  type: string;
  value1: string;
  value2?: string;
  inputCheck?: {
    email?: boolean;
    password?: boolean;
    passwordcheck?: boolean;
    currentpassword?: boolean;
    storename?: boolean;
    customername?: boolean;
    tel?: boolean;
    custom?: boolean;
  };
}> = ({ type, value1, value2, inputCheck }) => {
  let errorMsg = "　";

  switch (type) {
    case "email": {
      if (!inputCheck?.email) errorMsg = "　";
      else if (value1.trim() === "")
        errorMsg = "입력란을 빈칸으로 둘 수 없습니다.";
      else if (emailRegex.test(value1) === false)
        errorMsg = "정확한 이메일을 입력해주십시오.";
      break;
    }
    case "currentpassword": {
      if (!inputCheck?.password) errorMsg = "　";
      else if (value1.trim() === "")
        errorMsg = "입력란을 빈칸으로 둘 수 없습니다.";
      else if (passwordRegex.test(value1) === false)
        errorMsg =
          "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다.";
      break;
    }
    case "password": {
      if (!inputCheck?.password) errorMsg = "　";
      else if (value1.trim() === "")
        errorMsg = "입력란을 빈칸으로 둘 수 없습니다.";
      else if (passwordRegex.test(value1) === false)
        errorMsg =
          "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다.";
      break;
    }
    case "passwordcheck": {
      if (!inputCheck?.passwordcheck) errorMsg = "　";
      else if (value1.trim() === "")
        errorMsg = "입력란을 빈칸으로 둘 수 없습니다.";
      else if (passwordRegex.test(value1) === false)
        errorMsg =
          "비밀번호는 소문자, 숫자, 특수문자를 1글자씩 포함해야 합니다.";
      else if (value1.trim() !== value2!.trim())
        errorMsg = "비밀번호가 일치하지 않습니다.";
      break;
    }
    case "storename": {
      if (!inputCheck?.storename) errorMsg = "　";
      else if (value1.trim() === "")
        errorMsg = "매장명을 빈칸으로 둘 수 없습니다.";
      break;
    }
    case "customername": {
      if (!inputCheck?.customername) errorMsg = "　";
      else if (value1.trim() === "")
        errorMsg = "예약자명을 빈칸으로 둘 수 없습니다.";
      break;
    }
    case "tel": {
      if (!inputCheck?.tel) errorMsg = "　";
      else if (value1.trim() === "")
        errorMsg = "연락처를 빈칸으로 둘 수 없습니다.";
      break;
    }
    case "custom": {
      if (inputCheck!.custom === true) {
        if (value1.trim() === "")
          errorMsg = "해당 옵션이 활성화 중일 때는 빈칸으로 둘 수 없습니다.";
      }
      break;
    }

    default:
      errorMsg = "　";
  }

  return (
    <Text color="red" letterSpacing="-0.05rem" fontSize="0.75rem">
      {errorMsg!}
    </Text>
  );
};

export default CommonErrorMsg;
