import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link as ReactRouterLink } from "react-router-dom";
import CommonFooter from "../../common/commonfooter";

const MainContainer: React.FC = () => {
  return (
    <Flex as="section" direction="column">
      <Flex
        direction="row"
        justify="space-between"
        height="3.5rem"
        position="fixed"
        background="#FFFFFF"
        padding="1rem"
        width="100%"
        border="1px solid gray"
        top="0"
      >
        <Image src={process.env.PUBLIC_URL + "logoheader.png"} width="100px" />
        <Link as={ReactRouterLink} to="/adminlogin" color="mainBlue">
          로그인하기
        </Link>
      </Flex>
      <Flex
        as="article"
        direction="column"
        padding="4rem 0"
        background="#FFFFFF"
      >
        <Box textAlign="center" margin="3rem 0">
          <Heading as="h1" color="mainBlue" margin="1rem 0">
            소상공인 매장을 위한
            <br />
            웨이팅 관리 솔루션
          </Heading>
          <Text>
            웨이팅 관리가 필요하세요? <br />
            비용이 부담되신다고요?
            <br />
            기기 설치 위치가 마땅치 않으신가요?
          </Text>
          <Box textAlign="center" margin="3rem 0">
            <Heading as="h2" color="mainBlue" margin="1rem 0">
              지금, 웨잇세컨드를
              <br />
              이용해보세요.
            </Heading>
          </Box>

          <Flex
            justify="space-between"
            margin="3rem 0"
            padding="1rem"
            background="mainBlue"
          >
            <Flex direction="column" width="60%" wordBreak="keep-all">
              <Heading
                as="h3"
                fontSize="1rem"
                color="#FFFFFF"
                margin="1rem 0"
                textAlign="left"
              >
                웨잇세컨드는 이렇게
                <br />
                태어났습니다.
              </Heading>

              <Text
                color="#FFFFFF"
                margin="1rem 0"
                textAlign="left"
                fontSize="0.75rem"
              >
                많은 웨이팅 관리 서비스 속에 등장한 웨잇세컨드는 소상공인들의
                부담을 덜기 위해 탄생했습니다. <br />
              </Text>
            </Flex>
            <Box
              width="40%"
              overflow="hidden"
              margin="0 -1rem 0 0"
              shadow="dark-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1517601278517-456741619dad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1806&q=80"
                height="full"
                objectFit="cover"
                shadow="dark-lg"
              />
            </Box>
          </Flex>
          <Flex justify="space-between" margin="3rem 0" padding="0 1rem">
            <Box
              width="40%"
              overflow="hidden"
              margin="0 0 0 -1rem"
              shadow="dark-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1600147131759-880e94a6185f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80"
                height="full"
                objectFit="cover"
                shadow="dark-lg"
              />
            </Box>
            <Flex direction="column" width="60%" wordBreak="keep-all">
              <Heading
                as="h3"
                fontSize="1rem"
                color="mainBlue"
                margin="1rem 0"
                textAlign="right"
              >
                웨잇세컨드는 부담을
                <br />
                덜어줍니다.
              </Heading>

              <Text margin="1rem 0" textAlign="right" fontSize="0.75rem">
                다른 웨이팅 관리 서비스에 비해 기능이 부족하지만, 태블릿 등의
                설치 비용이나 공간 없이 QR 코드 하나만 있으면 기능을 손쉽게
                이용할 수 있습니다.
              </Text>
            </Flex>
          </Flex>
          <Flex
            justify="space-between"
            margin="3rem 0"
            padding="1rem"
            background="mainBlue"
          >
            <Flex direction="column" width="60%" wordBreak="keep-all">
              <Heading
                as="h3"
                fontSize="1rem"
                color="#FFFFFF"
                margin="1rem 0"
                textAlign="left"
              >
                웨잇세컨드는 계속해서
                <br />
                고민합니다.
              </Heading>

              <Text
                color="#FFFFFF"
                margin="1rem 0"
                textAlign="left"
                fontSize="0.75rem"
              >
                조금이라도 매장 운영에 도움이 되실 수 있도록, 그리고 기다리시는
                손님들이 편하게 이용하실 수 있도록.
                <br />
                <br />
                꾸준한 보완 및 업데이트로 더 좋은 서비스를 드리기 위해 노력할
                것입니다.
              </Text>
            </Flex>
            <Box
              width="40%"
              overflow="hidden"
              margin="0 -1rem 0 0"
              shadow="dark-lg"
            >
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/waitsecond-2306b.appspot.com/o/images%2Finfo_image.png?alt=media"
                height="full"
                objectFit="cover"
                shadow="dark-lg"
              />
            </Box>
          </Flex>
        </Box>

        <Box
          margin="auto"
          width="90%"
          background="subBlue"
          borderRadius="0.5rem"
          wordBreak="keep-all"
          padding="1rem 0"
        >
          <Heading
            as="h4"
            color="accentBlue"
            fontSize="1rem"
            padding="1rem 0"
            textAlign="center"
          >
            이용 문의 및 QR 코드 발급 안내
          </Heading>
          <Text padding="0.5rem 1.5rem" textAlign="center" fontSize="0.875rem">
            웨잇세컨드 이용 중 발생한 문의 사항이나 이용 상담 및 버그 제보,
            그리고 매장 QR코드 발급 안내는 아래의 버튼을 통해 이메일로
            문의해주세요.
          </Text>
          <Link
            href="mailto:developneoguri@gmail.com"
            display="flex"
            justifyContent="center"
            alignItems="center"
            background="mainBlue"
            fontWeight="semibold"
            color="#FFFFFF"
            padding="0.5rem auto"
            margin="1.5rem"
            borderRadius="0.25rem"
            height="3rem"
            _hover={{
              textDecoration: "none",
              background: "#E2E8F0",
              color: "#333333",
            }}
          >
            이메일로 문의
          </Link>
        </Box>
      </Flex>
      <CommonFooter />
    </Flex>
  );
};

export default MainContainer;
