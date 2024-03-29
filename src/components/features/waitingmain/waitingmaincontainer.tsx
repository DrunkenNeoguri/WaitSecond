import React, { useState, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { lowVisionState } from "../../../modules/atoms/atoms";
import { EventObject, StoreOption, UserData } from "../../../utils/typealies";
import { Link as ReactRouterLink } from "react-router-dom";
import { CommonTelInput } from "../../common/commoninput";
import { telRegex } from "../../../utils/reqlist";
import CommonErrorMsg from "../../common/commonerrormsg";
import CommonCloseBox from "../../common/commonclosebox";
import CommonFullBox from "../../common/commonfullbox";
import { useMetaTag, useTitle } from "../../../utils/customhook";
import ErrorPageContainer from "../errorpage/errorpagecontainer";
import CommonLoadingModal from "../../common/commonloadingmodal";
import { InfoIcon } from "@chakra-ui/icons";

const WaitingMainContainer: React.FC = () => {
  const { storeuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toastMsg = useToast();
  const visionState = useRecoilValue<boolean>(lowVisionState);
  const [telInput, setTelInput] = useState("");
  const [nonexistentCheck, setNonexistentCheck] = useState(false);
  const [inputCheck, setInputCheck] = useState(false);
  const [pageError, setPageError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const db = getFirestore();
  const waitingCol = query(collection(db, `storeList/${storeuid}/waitingList`));

  useLayoutEffect(() => {
    getDocs(waitingCol)
      .then((data) => {
        const list: any = [];
        data.forEach((doc) => {
          const userData = doc.data();
          list.push([userData, doc.id]);
          return list;
        });
        return list;
      })
      .then((list) => {
        const nowDate = new Date().getDate();
        list.forEach((document: any) => {
          const dataDate = new Date(document[0].createdAt!).getDate();
          if (nowDate !== dataDate) {
            deleteDoc(
              doc(db, `storeList/${storeuid}/waitingList`, document[1])
            );
          }
        });
      });
  }, []);

  // 현재 대기열 가져오기
  const getWaitingData = async () => {
    const waitingState = await getDocs(waitingCol).then((data) => {
      const list: any = [];
      const nowDate = new Date().getDate();
      data.forEach((doc) => {
        if (doc.data().isentered === false) {
          const dataDate = new Date(doc.data().createdAt!).getDate();
          if (nowDate === dataDate) {
            list.push(doc.data());
          }
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

  const inputUserTelNumber = (e: React.ChangeEvent) => {
    e.preventDefault();
    const { value }: EventObject = e.currentTarget;
    setTelInput(value!);

    if (inputCheck === false) {
      setInputCheck(true);
    }
  };

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

  const moveToWaitingStatePage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nonexistentCheck) {
      if (telInput === "" || telRegex.test(telInput) === false) {
        return !toastMsg.isActive("error-telCheck")
          ? toastMsg({
              title: "연락처 확인",
              id: "error-telCheck",
              description: "연락처를 제대로 입력했는지 확인해주세요.",
              status: "error",
              duration: 5000,
              isClosable: true,
            })
          : null;
      }
    }
    if (
      waitingList.data.filter((elem: UserData) => elem.tel === telInput)
        .length === 0
    ) {
      return !toastMsg.isActive("error-notRegisterWaiting")
        ? toastMsg({
            title: "등록되지 않음",
            id: "error-notRegisterWaiting",
            description: `해당 ${
              nonexistentCheck ? "대기번호" : "연락처"
            }로 등록된 정보가 없습니다. 대기 등록을 진행해주시길 바랍니다.`,
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        : null;
    }

    navigate(`${location.pathname}/waitingstate/${telInput}`);
  };

  if (pageError === true) {
    return (
      <Box padding="4rem 0" height="100vh">
        <ErrorPageContainer />
      </Box>
    );
  }
  if (storeOption.data === undefined) {
    return <CommonLoadingModal />;
  } else {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            wordBreak="keep-all"
            padding="1rem 0"
            margin="auto 1rem"
          >
            <ModalHeader
              display="flex"
              flexDirection="column"
              alignItems="center"
              margin="0.25rem 0"
              padding="1rem 0 0.5rem 0"
            >
              <InfoIcon
                color="mainBlue"
                fontSize={visionState ? "1.625rem" : "1.5rem"}
              />
              <Text
                margin="0.5rem"
                fontSize={visionState ? "1.625rem" : "1rem"}
                textAlign="center"
                color="mainBlue"
                fontWeight="bold"
              >
                개인 정보 수집 안내
              </Text>
            </ModalHeader>
            <ModalBody
              background="#F9F9F9"
              borderRadius="0.25rem"
              fontSize={visionState ? "1.625rem" : "0.75rem"}
              letterSpacing="-0.05rem"
              margin="0.25rem 1rem"
              padding="1rem"
              whiteSpace="pre-wrap"
              textAlign="left"
            >
              <Text
                lineHeight={visionState ? "2.25rem" : "1.25rem"}
                padding="0.5rem 0"
              >
                대기 등록 시, 예약자명과 연락처를 수집하고 있습니다.
              </Text>
              <Text
                lineHeight={visionState ? "2.25rem" : "1.25rem"}
                padding="0.5rem 0"
              >
                수집한 정보는 입장 안내를 위한 연락을 드리기 위해 사용되며,
                다음날 0시가 되면 등록하신 정보는 삭제됩니다.
              </Text>
              <Text
                lineHeight={visionState ? "2.25rem" : "1.25rem"}
                padding="0.5rem 0"
              >
                잘못된 정보를 입력하셨을 시, 매장 입장에 제한이 생길 수
                있습니다.
              </Text>
            </ModalBody>
            <ModalFooter
              display="flex"
              flexDirection="row"
              gap="1rem"
              margin="0.5rem 0"
              padding="0.5rem 1rem"
              justifyContent="space-between"
            >
              <Link
                as={ReactRouterLink}
                to={`${location.pathname}/waitingform`}
                display="flex"
                justifyContent="center"
                alignItems="center"
                background="mainBlue"
                fontWeight="semibold"
                fontSize={visionState ? "1.625rem" : "1.25rem"}
                color="#FFFFFF"
                borderRadius="0.25rem"
                width="100%"
                height="3rem"
                _hover={{ textDecoration: "none", background: "#E2E8F0" }}
              >
                대기 등록
              </Link>
              <Button
                type="button"
                background="accentGray"
                color="#ffffff"
                borderRadius="0.25rem"
                padding="0"
                height="3rem"
                width="100%"
                onClick={onClose}
                fontSize={visionState ? "1.625rem" : "1.25rem"}
              >
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <section>
          <Box
            display="flex"
            height="13rem"
            marginTop="3.5rem"
            overflow="hidden"
          >
            <Image
              src={storeOption.data?.storebg}
              objectFit="cover"
              height="100%"
              width="100%"
              loading="lazy"
            />
          </Box>
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
              {storeOption.data === undefined ? "" : storeOption.data.storeName}
            </Heading>

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
            {storeOption.data?.waitingState ? (
              storeOption.data!.maximumWaitingTeamCount <=
              waitingList.data.length ? (
                <CommonFullBox data={waitingList.data} />
              ) : (
                <Flex direction="column" fontSize="1rem" margin="1rem 0">
                  <Text
                    fontSize={visionState ? "1.625rem" : "1rem"}
                    color="mainBlue"
                  >
                    대기 등록을 원하시면
                  </Text>
                  <Button
                    type="button"
                    background="mainBlue"
                    color="#ffffff"
                    padding="1.5rem"
                    borderRadius="0.25rem"
                    width="100%"
                    fontSize={visionState ? "1.625rem" : "1.25rem"}
                    onClick={onOpen}
                  >
                    대기 등록
                  </Button>
                </Flex>
              )
            ) : (
              <CommonCloseBox />
            )}
            <Flex direction="column" fontSize="1rem" margin="1rem 0">
              <Text
                fontSize={visionState ? "1.625rem" : "1rem"}
                color="mainBlue"
              >
                이미 대기 등록을 하셨다면
              </Text>
              <form onSubmit={moveToWaitingStatePage}>
                <Flex direction="column" margin="0.5rem 0 0.5rem 0">
                  <CommonTelInput
                    id="tel"
                    title={nonexistentCheck ? "대기번호" : "연락처"}
                    type="tel"
                    value={telInput}
                    onChange={inputUserTelNumber}
                    margin="0.25rem 0"
                    placeholder={
                      nonexistentCheck
                        ? "대기번호 4자리를 입력해주세요."
                        : "'-' 빼고 입력해주세요."
                    }
                    fontSize={visionState ? "1.625rem" : "1rem"}
                    holderSize={visionState ? "1.625rem" : "0.75rem"}
                    checkBoxFunc={() => setNonexistentCheck(!nonexistentCheck)}
                    checkBoxIsChecked={nonexistentCheck}
                  />
                  <CommonErrorMsg
                    type="tel"
                    state={nonexistentCheck}
                    value1={telInput}
                    inputCheck={{ tel: inputCheck }}
                    fontSize={visionState ? "1.625rem" : "0.75rem"}
                  />
                </Flex>
                <Button
                  type="submit"
                  background="mainBlue"
                  fontWeight="semibold"
                  fontSize={visionState ? "1.625rem" : "1.5rem"}
                  color="#FFFFFF"
                  padding="0.5rem auto"
                  margin="0.5rem 0"
                  borderRadius="0.25rem"
                  height="3rem"
                  width="100%"
                >
                  대기 상태 확인
                </Button>
              </form>
            </Flex>
          </Flex>
        </section>
      </>
    );
  }
};

export default WaitingMainContainer;
