import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EventObject, StoreOption, UserData } from "../../../utils/typealies";
import { CommonInput } from "../../common/commoninput";
import { faBell, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { telRegex } from "../../../utils/reqlist";
import CheckDataModal from "./checkdatamodal";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { lowVisionState } from "../../../modules/atoms/atoms";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import CommonErrorMsg from "../../common/commonerrormsg";
import CommonCloseBox from "../../common/commonclosebox";
import CommonFullBox from "../../common/commonfullbox";
import { useMetaTag, useTitle } from "../../../utils/customhook";
import ErrorPageContainer from "../errorpage/errorpagecontainer";
import CommonCustomOption from "../../common/commoncustomoption";

const WaitingFormContainer: React.FC = () => {
  const initialState = new UserData(
    false,
    "",
    "",
    0,
    0,
    false,
    false,
    false,
    false,
    false,
    false,
    0,
    ""
  );

  const [userData, setUserData] = useState<UserData>(initialState);
  const [loadingState, setLoadingState] = useState(false);
  const [inputCheck, setInputCheck] = useState({
    customername: false,
    tel: false,
  });
  const [agreeState, setAgreeState] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const { storeuid } = useParams();
  const [pageError, setPageError] = useState(false);

  const db = getFirestore();
  const waitingCol = query(collection(db, `storeList/${storeuid}/waitingList`));

  // 현재 대기열 가져오기
  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      data.forEach((doc) => {
        if (!doc.data().isentered) {
          list.push(doc.data());
        }
      });
      list.sort(function (a: any, b: any) {
        return a.createdAt - b.createdAt;
      });
      return list;
    });
    return waitingState;
  };

  const waitingList = useQuery({
    queryKey: ["waitingList"],
    queryFn: getWaitingData,
  });

  // 관리자가 설정한 매장 관리 정보 가져오기
  const getStoreOption = async () => {
    const storeDataState: StoreOption | undefined = await getDocs(
      collection(db, "adminList")
    ).then((data) => {
      let adminData: any;
      data.forEach((doc) => {
        if (doc.data().uid === storeuid) {
          return (adminData = doc.data());
        }
      });
      return adminData!;
    });
    return storeDataState;
  };

  const storeOption = useQuery({
    queryKey: ["storeOption"],
    queryFn: getStoreOption,
    onError(error) {
      setPageError(true);
    },
  });

  useTitle(
    storeOption.data?.storeName !== undefined
      ? `${storeOption.data?.storeName} ::: 웨잇세컨드`
      : "맛집을 기다릴 땐, 웨잇세컨드!"
  );
  useMetaTag({ title: `${storeOption.data?.storeName} ::: 웨잇세컨드` });

  // Func - Input User Data
  const inputUserText = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.target;
    setUserData({ ...userData, [id]: value });

    if (e.target.id === "name" && !inputCheck.customername) {
      setInputCheck({ ...inputCheck, customername: true });
    }
    if (e.target.id === "tel" && !inputCheck.tel) {
      setInputCheck({ ...inputCheck, tel: true });
    }
  };

  // Func - change state when user clicked checkbox
  const changeCheckState = (e: React.ChangeEvent, state: boolean) => {
    e.preventDefault();
    setUserData({ ...userData, [e.currentTarget.id]: !state });
  };

  // Func - change state when user clicked member count button
  const changeMemberCount = (e: React.MouseEvent) => {
    e.preventDefault();
    const { id, value }: EventObject = e.currentTarget;

    switch (id) {
      case "adult": {
        if (Number(value)! === -1 && userData.adult > 0) {
          setUserData({
            ...userData,
            adult: userData.adult - 1,
          });
        } else if (
          Number(value)! === 1 &&
          storeOption.data?.maximumTeamMemberCount! >
            userData.adult + userData.child
        ) {
          setUserData({
            ...userData,
            adult: userData.adult + 1,
          });
        }
        break;
      }
      case "child": {
        if (Number(value)! === -1 && userData.child > 0) {
          setUserData({
            ...userData,
            child: userData.child - 1,
          });
        } else if (
          Number(value)! === 1 &&
          storeOption.data?.maximumTeamMemberCount! >
            userData.adult + userData.child
        ) {
          setUserData({
            ...userData,
            child: userData.child + 1,
          });
        }
        break;
      }
    }
  };

  // Func - change state when user clicked agree button
  const changeAgreeState = (e: React.ChangeEvent) => {
    e.preventDefault();
    setAgreeState(!agreeState);
  };

  const toastMsg = useToast();

  // Func - send data when user submit the data
  const submitUserData = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    if (!agreeState) {
      setLoadingState(false);
      return !toastMsg.isActive("error-infoCheck")
        ? toastMsg({
            title: "참고 사항 확인",
            id: "error-infoCheck",
            description: "참고 사항을 읽어주시고 확인란에 체크해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : undefined;
    }

    if (userData.name.trim() === "") {
      setLoadingState(false);
      return !toastMsg.isActive("error-nameCheck")
        ? toastMsg({
            title: "성함 확인",
            id: "error-nameCheck",
            description: "성함을 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : undefined;
    }

    if (userData.tel === "" || !telRegex.test(userData.tel)) {
      setLoadingState(false);
      return !toastMsg.isActive("error-telCheck")
        ? toastMsg({
            title: "연락처 확인",
            id: "error-telCheck",
            description: "연락처를 제대로 입력했는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : undefined;
    }

    if (userData.child === 0 && userData.adult === 0) {
      setLoadingState(false);
      return !toastMsg.isActive("error-memberCheck")
        ? toastMsg({
            title: "인원 수 확인",
            id: "error-memberCheck",
            description: "인원 수를 정확하게 입력하셨는지 확인해주세요.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : undefined;
    }

    const currentWaitingList = waitingList.data;
    let duplicateCheck;
    currentWaitingList.forEach((doc: UserData) => {
      if (doc.tel === userData.tel) {
        duplicateCheck = true;
      }
    });

    if (duplicateCheck === true) {
      setLoadingState(false);
      return !toastMsg.isActive("error-duplicateNumber")
        ? toastMsg({
            title: "이미 등록된 정보",
            id: "error-duplicateNumber",
            description: "이미 해당 번호로 대기를 등록하셨습니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : undefined;
    }
    return onOpen();
  };

  if (pageError === true) {
    return (
      <Box padding="4rem 0" height="100vh">
        <ErrorPageContainer />
      </Box>
    );
  } else {
    return (
      <section>
        <Box display="flex" height="13rem" marginTop="3.5rem" overflow="hidden">
          <Image
            src={storeOption.data?.storebg}
            objectFit="cover"
            height="100%"
            width="100%"
          />
        </Box>
        <CheckDataModal
          isOpen={isOpen}
          loadingState={setLoadingState}
          onClose={onClose}
          userInfo={userData}
          custom={[
            storeOption.data?.customOption1Name!,
            storeOption.data?.customOption2Name!,
            storeOption.data?.customOption3Name!,
          ]}
        />
        <Flex
          as="article"
          direction="column"
          background="#ffffff"
          padding="1rem"
          border="none"
          top="-4rem"
          wordBreak="keep-all"
        >
          <Heading
            as="h1"
            textAlign="center"
            letterSpacing="-0.05rem"
            padding="1rem 0"
          >
            {storeOption.data === undefined
              ? "불러오는중불러오는중불러오는중불러오는중"
              : storeOption.data.storeName}
          </Heading>
          {storeOption.data?.waitingState ? (
            storeOption.data.maximumWaitingTeamCount <=
            waitingList.data.length ? (
              <CommonFullBox data={waitingList.data} />
            ) : (
              <>
                <Flex
                  direction="row"
                  justify="space-between"
                  align="center"
                  fontSize={visionState ? "1.625rem" : "1.5rem"}
                  fontWeight="semibold"
                  letterSpacing="-0.1rem"
                  margin="0.5rem 0 1rem 0"
                >
                  <Text>현재 대기팀</Text>
                  <Text fontSize="1.75rem" fontWeight="700" color="mainBlue">
                    {waitingList.data === undefined
                      ? "확인 중"
                      : waitingList.data.length === 0
                      ? "없음"
                      : `${waitingList.data.length} 팀`}
                  </Text>
                </Flex>
                <form onSubmit={submitUserData}>
                  <FormControl>
                    <Flex direction="column">
                      <Flex direction="column" align="center" margin="1rem 0">
                        <FontAwesomeIcon
                          icon={faBell}
                          style={{
                            color: "orange",
                            fontSize: visionState ? "1.625rem" : "1.5rem",
                          }}
                        />
                        <Text
                          margin="0.5rem"
                          fontSize={visionState ? "1.625rem" : "1rem"}
                          textAlign="center"
                          color="mainBlue"
                          fontWeight="bold"
                        >
                          참고해주세요!
                        </Text>
                      </Flex>
                      <Text
                        background="#F9F9F9"
                        borderRadius="0.25rem"
                        fontSize={visionState ? "1.625rem" : "0.75rem"}
                        letterSpacing="-0.05rem"
                        lineHeight={visionState ? "2.25rem" : "1.5rem"}
                        padding="0.5rem"
                        whiteSpace="pre-wrap"
                        textAlign="left"
                      >
                        대기 등록을 위해 성함과 연락처를 수집하고 있습니다.
                        {visionState ? (
                          <>
                            <br />
                            <br />
                          </>
                        ) : (
                          <br />
                        )}
                        수집한 정보는 대기 취소 버튼을 누르시거나, 입장 후
                        관리자가 입장 완료 버튼을 누르면 삭제됩니다.
                        {visionState ? (
                          <>
                            <br />
                            <br />
                          </>
                        ) : (
                          <br />
                        )}
                        잘못된 정보를 입력하셨을 시, 매장 입장에 제한이 생길 수
                        있습니다.
                      </Text>
                      <Flex
                        direction="row"
                        align="center"
                        justifyContent="flex-end"
                        margin="0.5rem 0"
                      >
                        <Checkbox
                          size={visionState ? "lg" : "md"}
                          id="agree"
                          onChange={changeAgreeState}
                          isChecked={!agreeState ? false : true}
                          variant="customBlue"
                        />
                        <FormLabel
                          htmlFor="agree"
                          fontSize={visionState ? "1.625rem" : "0.75rem"}
                          margin="0 0.5rem"
                          cursor="pointer"
                        >
                          확인했습니다.
                        </FormLabel>
                      </Flex>
                    </Flex>
                    <Box
                      display="block"
                      background="#d4d4d4"
                      height="0.125rem"
                      borderRadius="1rem"
                      boxSizing="border-box"
                      margin="2rem 1rem 2.5rem 1rem"
                    />
                    <CommonInput
                      id="name"
                      title="예약자명"
                      type="text"
                      value={userData.name}
                      onChange={inputUserText}
                      margin="0.25rem 0"
                      maxLength={15}
                      fontSize={visionState ? "1.625rem" : "1rem"}
                    />
                    <CommonErrorMsg
                      type="customername"
                      value1={userData.name!}
                      inputCheck={inputCheck}
                      fontSize={visionState ? "1.5rem" : "0.75rem"}
                    />
                    <CommonInput
                      id="tel"
                      title="연락처"
                      type="tel"
                      value={userData.tel}
                      onChange={inputUserText}
                      margin="0.25rem 0"
                      placeholder="'-' 빼고 입력해주세요."
                      fontSize={visionState ? "1.625rem" : "1rem"}
                      holderSize={visionState ? "1.625rem" : "0.75rem"}
                    />
                    <CommonErrorMsg
                      type="tel"
                      value1={userData.tel}
                      inputCheck={inputCheck}
                      fontSize={visionState ? "1.5rem" : "0.75rem"}
                    />
                    <Flex direction="column" margin="1.5rem 0 0.5rem 0">
                      <Text
                        fontWeight="bold"
                        textAlign="left"
                        margin="0.5rem 0"
                        fontSize={visionState ? "1.625rem" : "1rem"}
                      >
                        인원을 선택하세요.{visionState ? <br /> : " "}(최대
                        인원: {storeOption.data?.maximumTeamMemberCount}명)
                      </Text>
                      <Flex
                        justify="space-between"
                        align="center"
                        margin="0.5rem 0"
                      >
                        <FormLabel
                          fontSize={visionState ? "1.625rem" : "1rem"}
                          fontWeight="semibold"
                          margin="0"
                        >
                          성　인
                        </FormLabel>
                        <Flex justify="space-between" align="center">
                          <Button
                            size="sm"
                            id="adult"
                            value={-1}
                            onClick={changeMemberCount}
                            background="mainBlue"
                            fontSize={visionState ? "1.625rem" : "0.875rem"}
                            color="#FFFFFF"
                            borderRadius="0.25rem"
                            padding="0"
                            _hover={{
                              background: "subBlue",
                            }}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>
                          <Flex
                            justify="center"
                            align="center"
                            height="auto"
                            fontSize={visionState ? "1.625rem" : "1rem"}
                            color="#000000"
                            padding="0 1rem"
                            width="5rem"
                          >
                            {userData.adult}명
                          </Flex>

                          <Button
                            size="sm"
                            id="adult"
                            value={1}
                            onClick={changeMemberCount}
                            background="mainBlue"
                            fontSize={visionState ? "1.625rem" : "1rem"}
                            color="#FFFFFF"
                            borderRadius="0.25rem"
                            padding="0"
                            _hover={{
                              background: "subBlue",
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </Flex>
                      </Flex>
                      <Flex
                        justify="space-between"
                        align="center"
                        margin="0.5rem 0"
                      >
                        <FormLabel
                          fontSize={visionState ? "1.625rem" : "1rem"}
                          fontWeight="semibold"
                          margin="0"
                        >
                          유　아
                        </FormLabel>
                        <Flex justify="space-between" align="center">
                          <Button
                            size="sm"
                            id="child"
                            value={-1}
                            onClick={changeMemberCount}
                            background="mainBlue"
                            fontSize={visionState ? "1.625rem" : "0.875rem"}
                            color="#FFFFFF"
                            borderRadius="0.25rem"
                            padding="0"
                            _hover={{
                              background: "subBlue",
                            }}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>
                          <Flex
                            justify="center"
                            align="center"
                            height="auto"
                            fontSize={visionState ? "1.625rem" : "1rem"}
                            color="#000000"
                            padding="0 1rem"
                            width="5rem"
                          >
                            {userData.child}명
                          </Flex>

                          <Button
                            size="sm"
                            id="child"
                            value={1}
                            onClick={changeMemberCount}
                            background="mainBlue"
                            fontSize={visionState ? "1.625rem" : "1rem"}
                            color="#FFFFFF"
                            borderRadius="0.25rem"
                            padding="0"
                            _hover={{
                              background: "subBlue",
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Flex
                      direction="column"
                      background="#F9F9F9"
                      padding="0.75rem"
                    >
                      <CommonCustomOption
                        state={storeOption.data?.petAllow}
                        id="pet"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.pet!)
                        }
                        text="반려 동물이 있어요."
                        isChecked={userData.pet!}
                      />
                      <CommonCustomOption
                        state={storeOption.data?.teamSeparate}
                        id="separate"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.separate!)
                        }
                        text="자리가 나면 따로 앉아도 괜찮아요."
                        isChecked={userData.separate!}
                      />
                      <CommonCustomOption
                        state={storeOption.data?.outdoorSeat}
                        id="outdoorseat"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.outdoorseat!)
                        }
                        text="야외석으로 안내해주세요."
                        isChecked={userData.outdoorseat!}
                      />
                      <CommonCustomOption
                        state={storeOption.data?.customOption1State}
                        id="custom1"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.custom1!)
                        }
                        text={storeOption.data.customOption1Name}
                        isChecked={userData.custom1!}
                      />
                      <CommonCustomOption
                        state={storeOption.data?.customOption2State}
                        id="custom2"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.custom2!)
                        }
                        text={storeOption.data.customOption2Name}
                        isChecked={userData.custom2!}
                      />{" "}
                      <CommonCustomOption
                        state={storeOption.data?.customOption3State}
                        id="custom3"
                        onChange={(e: React.ChangeEvent) =>
                          changeCheckState(e, userData.custom3!)
                        }
                        text={storeOption.data.customOption3Name}
                        isChecked={userData.custom3!}
                      />
                    </Flex>
                    <Button
                      type="submit"
                      background="mainBlue"
                      fontSize={visionState ? "1.625rem" : "1.5rem"}
                      color="#FFFFFF"
                      padding="0.5rem auto"
                      margin="1rem 0"
                      borderRadius="0.25rem"
                      height="3rem"
                      width="100%"
                      isLoading={loadingState}
                    >
                      대기 등록
                    </Button>
                  </FormControl>
                </form>
              </>
            )
          ) : (
            <CommonCloseBox />
          )}
        </Flex>
      </section>
    );
  }
};

export default WaitingFormContainer;
