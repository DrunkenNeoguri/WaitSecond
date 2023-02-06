import { TypedCommonInput } from "../../utils/typealies";
import { Flex, FormLabel, Input } from "@chakra-ui/react";

//</Flex><Flex justify="space-between" margin="2rem 0">

export const CommonInput = (props: TypedCommonInput) => {
  return (
    <Flex
      justify={props.justify}
      align={props.align}
      margin={props.margin}
      padding={props.padding}
    >
      <FormLabel
        htmlFor={props.id}
        fontSize={props.fontSize}
        fontWeight={props.fontWeight}
        width={props.labelWidth}
      >
        {props.title}
      </FormLabel>
      <Input
        size="md"
        id={props.id}
        value={props.value}
        type={props.type}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        onChange={props.onChange}
        fontSize={props.fontSize}
        width={props.inputWidth}
      ></Input>
    </Flex>
  );
};
