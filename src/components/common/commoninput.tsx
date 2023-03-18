import { TypedCommonInput } from "../../utils/typealies";
import { Flex, FormLabel, Input } from "@chakra-ui/react";

//</Flex><Flex justify="space-between" margin="2rem 0">

export const CommonInput = (props: TypedCommonInput) => {
  return (
    <Flex
      direction="column"
      justify={props.justify}
      align={props.align}
      margin={props.margin}
      padding={props.padding}
    >
      <FormLabel htmlFor={props.id} fontSize={props.fontSize} fontWeight="bold">
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
