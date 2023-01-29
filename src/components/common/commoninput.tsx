import styled from "styled-components";
import { TypedCommonInput } from "../../utils/typealies";
import { CommonColumnBox } from "./commonui";

const CommonInput = (props: TypedCommonInput) => {
  return (
    <CommonColumnBox>
      <STCommonLabel htmlFor={props.id}>{props.title}</STCommonLabel>
      <STCommonInput
        id={props.id}
        value={props.value}
        type={props.type}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        onChange={props.onChange}
      />
    </CommonColumnBox>
  );
};

export default CommonInput;

const STCommonLabel = styled.label``;

const STCommonInput = styled.input``;
