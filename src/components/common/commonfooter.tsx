import { Flex, Image, Link, Text } from "@chakra-ui/react";

const CommonFooter: React.FC = () => {
  return (
    <Flex
      direction="column"
      width="100%"
      background="accentGray"
      justify="center"
      align="center"
      padding="2rem 0"
      gap="1rem"
    >
      <Text color="#FFFFFF">
        2023{" "}
        <Link href="https://github.com/DrunkenNeoguri">@DrunkenNeoguri</Link>{" "}
        Present.
      </Text>
      <Flex
        margin="auto"
        justify="space-between"
        color="#FFFFFF"
        gap="2rem"
        fontSize="0.75rem"
      >
        <Link href="https://github.com/DrunkenNeoguri">개발자 깃허브</Link>
        <Link href="mailto:developneoguri@gmail.com">개발자 이메일</Link>
        <Link href="https://develop-neoguri.notion.site/Re-da4bf54e1c5e40f1b2e8a22790e2d55e">
          개발자 블로그
        </Link>
      </Flex>
    </Flex>
  );
};

export default CommonFooter;
