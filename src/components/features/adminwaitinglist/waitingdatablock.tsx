import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { useState } from "react";

const WaitingDataBlock: React.FC = () => {
  const [openState, setOpenState] = useState(false);

  return (
    <>
      <Flex
        direction="row"
        padding="0.5rem"
        justify="space-between"
        width="100%"
        backgroundColor="#ffffff"
        borderTop="1px solid black"
        onClick={() => setOpenState(!openState)}
        cursor="pointer"
      >
        <Flex direction="column" gap="0.25rem">
          <Flex
            direction="row"
            gap="0.5rem"
            margin="0.5rem"
            fontSize="1rem"
            pointerEvents="none"
          >
            <Text fontWeight="bold">Thornton F. Butterfield</Text> 님
          </Flex>
          <Flex
            direction="row"
            gap="0.5rem"
            alignItems="center"
            fontSize="0.75rem"
            margin="0.25rem 0"
            pointerEvents="none"
          >
            <Text margin="0 0.5rem" fontWeight="bold">
              11:59
            </Text>
            <Flex direction="row" gap="0.25rem">
              성인 <Text fontWeight="bold">5명</Text>
            </Flex>
            <Flex direction="row" gap="0.25rem">
              유아 <Text fontWeight="bold">2명</Text>
            </Flex>
            <Text fontWeight="bold">·</Text>
            <Text>옵션</Text>
          </Flex>
        </Flex>
        <Flex direction="row" align="center" gap="1rem" margin="0 0.5rem">
          <Link href="tel:01075520121" onClick={(e) => e.stopPropagation()}>
            <Button
              width="3rem"
              height="3rem"
              backgroundColor="green"
              fontSize="0.5rem"
              color="#ffffff"
              fontWeight="normal"
            >
              전화
            </Button>
          </Link>

          <Button
            width="3rem"
            height="3rem"
            backgroundColor="#4E95FF"
            fontSize="0.5rem"
            color="#ffffff"
            fontWeight="normal"
            onClick={(e) => e.stopPropagation()}
          >
            입장 완료
          </Button>
        </Flex>
      </Flex>

      {openState ? (
        <Flex
          direction="row"
          padding="1rem"
          justify="flex-start"
          width="100%"
          fontSize="0.75rem"
          backgroundColor="#5A5A5A"
          gap="1rem"
        >
          <Text color="#ffffff">옵션 사항</Text>
          <Text color="yellow">반려 동물</Text>
        </Flex>
      ) : (
        <></>
      )}
    </>
  );
};

export default WaitingDataBlock;
