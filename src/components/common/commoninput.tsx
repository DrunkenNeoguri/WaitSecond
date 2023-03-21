import { TypedCommonInput } from "../../utils/typealies";
import { Flex, FormLabel, Input } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { lowVisionState } from "../../modules/atoms/atoms";

export const CommonInput = (props: TypedCommonInput) => {
  const visionState = useRecoilValue<boolean>(lowVisionState);

  return (
    <Flex
      direction="column"
      justify={props.justify}
      align={props.align}
      margin={props.margin}
      padding={props.padding}
    >
      <FormLabel
        htmlFor={props.id}
        fontSize={!visionState ? "1rem" : "1.625rem"}
        fontWeight="semibold"
      >
        {props.title}
      </FormLabel>
      <Input
        size="md"
        background="#F9F9F9"
        border="1px solid #F1F1F1"
        id={props.id}
        value={props.value}
        type={props.type}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        onChange={props.onChange}
        fontSize={props.fontSize}
        width="100%"
        _focus={{ background: "#FFFFFF" }}
      ></Input>
    </Flex>
  );
};
