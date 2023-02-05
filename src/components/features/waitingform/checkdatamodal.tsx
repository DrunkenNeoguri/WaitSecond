import React, { Dispatch, SetStateAction } from "react";
import { UserData } from "../../../utils/typealies";
import styled from "styled-components";
import {
  CommonBlackBackground,
  CommonColumnBox,
  CommonRowBox,
} from "../../common/commonui";
import { StCommonLabel } from "../../common/commoninput";
import CommonButton from "../../common/commonbutton";

const CheckDataModal: React.FC<{
  userInfo: UserData;
  close: Dispatch<SetStateAction<boolean>>;
}> = ({ userInfo, close }) => {
  return (
    <>
      <CommonBlackBackground>
        <StModalContainer>
          <h2
            style={{
              fontSize: "1.25rem",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            작성 내용을 확인해주세요.
          </h2>
          <CommonColumnBox>
            <CommonRowBox
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <StCommonLabel>성함</StCommonLabel>
              <span
                style={{
                  fontSize: "1.25rem",
                  color: "#58a6dc",
                  fontWeight: "600",
                }}
              >
                {userInfo.name}
              </span>
            </CommonRowBox>
            <CommonRowBox
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <StCommonLabel>연락처</StCommonLabel>
              <span
                style={{
                  fontSize: "1.25rem",
                  color: "#58a6dc",
                  fontWeight: "600",
                }}
              >
                {" "}
                {userInfo.tel}
              </span>
            </CommonRowBox>
            <CommonRowBox
              justifyContent="space-between"
              alignItems="center"
              margin="0.5rem 0"
            >
              <StCommonLabel>인원</StCommonLabel>
              <span
                style={{
                  fontSize: "1.25rem",
                  color: "#58a6dc",
                  fontWeight: "600",
                }}
              >
                {userInfo.member}명
              </span>
            </CommonRowBox>
            {userInfo.pet === true || userInfo.child === true ? (
              <CommonColumnBox margin="0.5rem 0">
                <StCommonLabel>옵션</StCommonLabel>
                <CommonColumnBox>
                  <ul style={{ margin: "0 2rem" }}>
                    {userInfo.child === true ? (
                      <li style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>
                        <span style={{ color: "#58a6dc", fontWeight: "600" }}>
                          아이
                        </span>
                        가 있어요.
                      </li>
                    ) : (
                      <></>
                    )}
                    {userInfo.pet === true ? (
                      <li style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>
                        <span style={{ color: "#58a6dc", fontWeight: "600" }}>
                          반려 동물
                        </span>
                        이 있어요.
                      </li>
                    ) : (
                      <></>
                    )}
                  </ul>
                </CommonColumnBox>
              </CommonColumnBox>
            ) : (
              <></>
            )}
          </CommonColumnBox>
          <CommonRowBox gap="1rem" margin="1rem 0 0 0">
            <CommonButton
              type="button"
              background="#58a6dc"
              color="#ffffff"
              border="1px solid gray"
              borderRadius="0.25rem"
              padding="1rem"
              fontSize="1.25rem"
            >
              맞습니다
            </CommonButton>
            <CommonButton
              type="button"
              background="#5a5a5a"
              color="#ffffff"
              border="1px solid gray"
              borderRadius="0.25rem"
              padding="1rem"
              onClick={() => close(false)}
              fontSize="1.25rem"
            >
              아니에요
            </CommonButton>
          </CommonRowBox>
        </StModalContainer>
      </CommonBlackBackground>
    </>
  );
};
export default CheckDataModal;

const StModalContainer = styled.div`
  background: #ffffff;
  margin: 10vh 1rem;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-contents: center;
  border-radius: 0.5rem;
`;
