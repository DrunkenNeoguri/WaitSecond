import { Checkbox, Flex, FormLabel } from "@chakra-ui/react";
import { lowVisionState } from "../../modules/atoms/atoms";
import { useRecoilValue } from "recoil";

const CommonCustomOption: React.FC<{
  state: boolean;
  id: string;
  onChange: (e: React.ChangeEvent) => void;
  text: string;
  isChecked: boolean;
}> = ({ state, id, onChange, text, isChecked }) => {
  const visionState = useRecoilValue<boolean>(lowVisionState);

  switch (state) {
    case false:
      return <></>;
    case true:
      return (
        <Flex align="center" margin="0.25rem 0" letterSpacing="-0.05rem">
          <Checkbox
            size={visionState ? "lg" : "md"}
            id={id}
            onChange={onChange}
            borderRadius="0.5rem"
            isChecked={!isChecked ? false : true}
            variant="customBlue"
            margin={visionState ? "0.5rem 0 auto 0" : "0"}
          />
          <FormLabel
            fontWeight="500"
            width="auto"
            margin="0 0.5rem"
            htmlFor={id}
            cursor="pointer"
            fontSize={visionState ? "1.625rem" : "0.75rem"}
          >
            {text}
          </FormLabel>
        </Flex>
      );
  }
};
export default CommonCustomOption;
