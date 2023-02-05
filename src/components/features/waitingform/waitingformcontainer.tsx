import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EventObject,
  UserData,
  StyledCheckBox,
} from "../../../utils/typealies";
import { CommonRowInput, StCommonLabel } from "../../common/commoninput";
import {
  CommonRowBox,
  CommonColumnBox,
  CommonBorder,
} from "../../common/commonui";
import {
  faMinus,
  faPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import CommonButton from "../../common/commonbutton";
import { telRegex } from "../../../utils/reqlist";
import CheckDataModal from "./checkdatamodal";

const WaitingFormContainer: React.FC = () => {
  const initialState = new UserData("", "", 1, false, false);

  const [userData, setUserData] = useState<UserData>(initialState);
  const [agreeState, setAgreeState] = useState(false);
  const [modalState, setModalState] = useState(false);

  // Func - Input User Data
  const inputUserText = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setUserData({ ...userData, [id]: value });
  };

  // Func - change state when user clicked checkbox
  const changeCheckState = (e: React.MouseEvent, state: boolean) => {
    e.preventDefault();
    setUserData({ ...userData, [e.currentTarget.id]: !state });
  };

  // Func - change state when user clicked member count button
  const changeMemberCount = (e: React.MouseEvent) => {
    e.preventDefault();

    if (e.currentTarget.id === "countMinus" && userData.member > 1) {
      setUserData({ ...userData, member: userData.member - 1 });
    } else if (e.currentTarget.id === "countPlus") {
      setUserData({ ...userData, member: userData.member + 1 });
    }
  };

  // Func - change state when user clicked agree button
  const changeAgreeState = (e: React.MouseEvent) => {
    e.preventDefault();
    setAgreeState(!agreeState);
  };

  // Func - send data when user submit the data
  const submitUserData = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreeState === false) {
      return alert("참고 사항을 읽어주시고 확인란에 체크해주세요.");
    }

    if (userData.name.trim() === "") {
      return alert("성함을 입력해주세요.");
    }

    if (userData.tel === "" || telRegex.test(userData.tel) === false) {
      return alert("연락처를 정확하게 작성해주세요.");
    }

    setModalState(true);
  };

  return (
    <section>
      <StBackground />
      {modalState === true ? (
        <CheckDataModal userInfo={userData} close={setModalState} />
      ) : (
        <></>
      )}
      <StArticle>
        <StShopTitle>너굴 상점</StShopTitle>
        <StNowWaitingTeamBlock>
          <p>현재 대기 팀</p>
          <p
            style={{ fontSize: "1.75rem", fontWeight: "700", color: "#58a6dc" }}
          >
            4팀
          </p>
        </StNowWaitingTeamBlock>
        <form onSubmit={submitUserData}>
          <CommonColumnBox>
            <CommonRowBox alignItems="center">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{
                  color: "red",
                  fontSize: "1.5rem",
                }}
              />
              <p
                style={{
                  margin: "0 0.5rem",
                  fontSize: "1.5rem",
                  color: "#58a6dc",
                  fontWeight: "600",
                }}
              >
                참고해주세요!
              </p>
            </CommonRowBox>
            <p
              style={{
                border: "2px solid #4E95FF",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                letterSpacing: "-2%",
                lineHeight: "1.25rem",
                margin: "1.5rem 0",
                padding: "0.25rem",
                whiteSpace: "pre-wrap",
              }}
            >
              대기 등록을 위해 성함과 연락처를 수집하고 있습니다. 수집한 정보는
              가게에 입장하거나, 대기 취소 시 자동으로 삭제됩니다.
            </p>
            <CommonRowBox alignItems="center">
              <StCheckBox
                type="button"
                id="agree"
                onClick={changeAgreeState}
                isChecked={agreeState === false ? "none" : "#5ABFB7"}
              />
              <label
                htmlFor="agree"
                style={{ fontSize: "1.25rem", margin: "0 0.5rem" }}
              >
                확인했습니다.
              </label>
            </CommonRowBox>
          </CommonColumnBox>
          <CommonBorder />
          <CommonRowInput
            id="name"
            type="text"
            title="성함"
            value={userData.name}
            onChange={inputUserText}
          />
          <CommonRowInput
            id="tel"
            type="tel"
            title="연락처"
            value={userData.tel}
            onChange={inputUserText}
          />
          <CommonRowBox
            alignItems="center"
            justifyContent="space-between"
            margin="2rem 0"
          >
            <StCommonLabel>인원</StCommonLabel>
            <div
              style={{
                display: "flex",
                width: "70%",
                justifyContent: "space-between",
                flex: "1 0 2.5rem",
              }}
            >
              <button
                id="countMinus"
                onClick={changeMemberCount}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "2.5rem",
                  flex: "1 0 2.5rem",
                  margin: "0 1rem 0 0",
                  background: "#5ABFB7",
                  fontSize: "1.5rem",
                  color: "#FFFFFF",
                  padding: 0,
                  borderRadius: "4px",
                  border: "1px solid gray",
                }}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "2.5rem",
                  fontSize: "1.5rem",
                  color: "#000000",
                  padding: "0.5rem 0",
                  borderRadius: "4px",
                  border: "1px solid gray",
                  width: "100%",
                }}
              >
                {userData.member}명
              </span>
              <button
                id="countPlus"
                onClick={changeMemberCount}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "2.5rem",
                  flex: "1 0 2.5rem",
                  margin: "0 0 0 1rem",
                  background: "#5ABFB7",
                  fontSize: "1.5rem",
                  color: "#FFFFFF",
                  padding: 0,
                  borderRadius: "4px",
                  border: "1px solid gray",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </CommonRowBox>
          <div>
            <CommonRowBox alignItems="center" margin="1rem 0">
              <StCheckBox
                type="button"
                id="child"
                onClick={(e) => changeCheckState(e, userData.child!)}
                isChecked={userData.child === false ? "none" : "#5ABFB7"}
              />
              <StCommonLabel width="auto" style={{ margin: "0 0.5rem" }}>
                아이가 있어요.
              </StCommonLabel>
            </CommonRowBox>
            <CommonRowBox alignItems="center" margin="1rem 0">
              <StCheckBox
                type="button"
                id="pet"
                onClick={(e) => changeCheckState(e, userData.pet!)}
                isChecked={userData.pet === false ? "none" : "#5ABFB7"}
              />
              <StCommonLabel width="auto" style={{ margin: "0 0.5rem" }}>
                반려 동물이 있어요.
              </StCommonLabel>
            </CommonRowBox>
          </div>
          <CommonButton
            type="submit"
            border="1px solid gray"
            background="#5ABFB7"
            padding="0.5rem 0"
            fontSize="1.5rem"
            borderRadius="0.25rem"
            color="#ffffff"
          >
            대기 등록
          </CommonButton>
        </form>
      </StArticle>
    </section>
  );
};

export default WaitingFormContainer;

const StBackground = styled.div`
  background: #58a6dc;
  display: block;
  height: 13rem;
  margin-top: 3.5rem;
`;

const StArticle = styled.article`
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffffff;
  padding: 2rem 1rem;
  margin: 0 1rem;
  border: none;
  border-radius: 1rem 1rem 0 0;
  top: -4rem;
  box-shadow: 0px 4px 6px rgba(90, 90, 90, 30%);
`;

const StShopTitle = styled.h1`
  margin: auto;
  font-size: 1.875rem;
  font-weight: 700;
`;

const StNowWaitingTeamBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  margin: 1.5rem 0;
`;

const StCheckBox = styled.button<StyledCheckBox>`
  background-color: ${(props) => props.isChecked};

  border: 2px solid gray;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  outline: none;

  width: 1.5rem;
  height: 1.5rem;

  cursor: pointer;
`;
