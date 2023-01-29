import React, { useState } from "react";
import styled from "styled-components";
import {
  EventObject,
  UserData,
  StyledCheckBox,
} from "../../../utils/typealies";
import CommonInput from "../../common/commoninput";
import { CommonRowBox } from "../../common/commonui";

const WaitingFormContainer: React.FC = () => {
  const initialState: UserData = {
    name: "",
    tel: "",
    member: 0,
    child: false,
    pet: false,
  };

  const [userData, setUserData] = useState<UserData>(initialState);
  const [agreeState, setAgreeState] = useState(false);

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
    if (e.currentTarget.id === "countMinus" && userData.member > 0) {
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

  return (
    <section>
      <STBackground />
      <STArticle>
        <STNowWaitingTeamBlock></STNowWaitingTeamBlock>
        <form>
          <CommonInput
            id="name"
            type="text"
            title="이름"
            value={userData.name}
            onChange={inputUserText}
          />
          <CommonInput
            id="tel"
            type="tel"
            title="전화번호"
            value={userData.tel}
            onChange={inputUserText}
          />
          <CommonRowBox>
            <button id="countMinus" onClick={changeMemberCount}>
              -
            </button>
            <span>{userData.member}</span>
            <button id="countPlus" onClick={changeMemberCount}>
              +
            </button>
          </CommonRowBox>
          <div>
            <CommonRowBox>
              <STCheckBox
                type="button"
                id="child"
                onClick={(e) => changeCheckState(e, userData.child!)}
                isChecked={userData.child === false ? "none" : "#5ABFB7"}
              />
              <label htmlFor="child">유아 동반</label>
            </CommonRowBox>
            <CommonRowBox>
              <STCheckBox
                type="button"
                id="pet"
                onClick={(e) => changeCheckState(e, userData.pet!)}
                isChecked={userData.pet === false ? "none" : "#5ABFB7"}
              />
              <label htmlFor="pet">애완동물 동반</label>
            </CommonRowBox>
          </div>
          <div>
            <STCheckBox
              type="button"
              id="agree"
              onClick={changeAgreeState}
              isChecked={agreeState === false ? "none" : "#5ABFB7"}
            />
            <label htmlFor="agree">
              대기 등록을 위해 성함과 연락처를 제공하는 것에 동의합니다. (가게에
              입장하거나 취소하시면 등록하신 데이터는 삭제됩니다.)
            </label>
          </div>
          <button>대기 등록</button>
        </form>
      </STArticle>
    </section>
  );
};

export default WaitingFormContainer;

const STBackground = styled.div`
  display: block;
  position: relative;
`;

const STArticle = styled.article``;

const STNowWaitingTeamBlock = styled.div``;

const STCheckBox = styled.button<StyledCheckBox>`
  background-color: ${(props) => props.isChecked};

  border: 2px solid gray;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  outline: none;

  width: 1rem;
  height: 1rem;

  cursor: pointer;
`;
