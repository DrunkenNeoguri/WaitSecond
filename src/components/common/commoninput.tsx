import styled from "styled-components";
import { TypedCommonInput } from "../../utils/typealies";

const CommonInput = (props: TypedCommonInput) => {
  return (
    <>
      <STCommonLabel htmlFor={props.id}></STCommonLabel>
      <STCommonInput
        id={props.id}
        value={props.value}
        type={props.type}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      />
    </>
  );
};

export default CommonInput;

const STCommonLabel = styled.label``;

const STCommonInput = styled.input``;
