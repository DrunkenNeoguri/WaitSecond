import { Button, Flex } from "@chakra-ui/react";

const CommonSwitchButton: React.FC<{
  id: string;
  attribute: boolean;
  on: (e: React.MouseEvent) => void;
  off: (e: React.MouseEvent) => void;
}> = ({ id, attribute, on, off }) => {
  return (
    <Flex>
      <Button
        id={id}
        borderRadius="0.25rem 0 0 0.25rem"
        padding="0px 1.5rem"
        background={attribute ? "mainBlue" : "#FFFFFF"}
        color={attribute ? "#FFFFFF" : "#333333"}
        borderTop="2px solid"
        borderBottom="2px solid"
        borderLeft="2px solid"
        borderColor={attribute ? "mainBlue" : "mainGray"}
        fontSize="0.75rem"
        size="sm"
        onClick={on}
        _hover={{
          background: "subBlue",
          borderColor: "subBlue",
          color: "#FFFFFF",
        }}
      >
        가능
      </Button>
      <Button
        id={id}
        borderRadius="0 0.25rem 0.25rem 0"
        padding="0px 1.5rem"
        background={!attribute ? "mainBlue" : "#FFFFFF"}
        color={!attribute ? "#FFFFFF" : "#333333"}
        borderTop="2px solid"
        borderBottom="2px solid"
        borderRight="2px solid"
        borderColor={!attribute ? "mainBlue" : "mainGray"}
        fontSize="0.75rem"
        size="sm"
        onClick={off}
        _hover={{
          background: "subBlue",
          borderColor: "subBlue",
          color: "#FFFFFF",
        }}
      >
        불가
      </Button>
    </Flex>
  );
};

export default CommonSwitchButton;
