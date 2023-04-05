import { TypedCommonInput } from "../../utils/typealies";
import { Flex, FormLabel, Input } from "@chakra-ui/react";

export const CommonInput = (props: TypedCommonInput) => {
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
        fontSize={props.fontSize}
        fontWeight="semibold"
      >
        {props.title}
      </FormLabel>
      <Input
        size="md"
        background="#F9F9F9"
        borderColor="#B4B4B4"
        id={props.id}
        value={props.value}
        type={props.type}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        onChange={props.onChange}
        fontSize={props.fontSize}
        width="100%"
        isDisabled={props.isDisabled}
        _focus={{ background: "#FFFFFF" }}
        _placeholder={{
          color: "#accentGray",
          fontSize: props.holderSize ? props.holderSize : "0.75rem",
          letterSpacing: "-0.05rem",
        }}
      ></Input>
    </Flex>
  );
};
