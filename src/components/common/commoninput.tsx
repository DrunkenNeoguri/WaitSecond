import styled from "styled-components";
import { TypedCommonInput } from "../../utils/typealies";
import { CommonColumnBox, CommonRowBox } from "./commonui";
import { StyledCommonType } from "../../utils/typealies";

export const CommonRowInput = (props: TypedCommonInput) => {
  return (
    <CommonRowBox justifyContent="space-between" margin="2rem 0">
      <StCommonLabel htmlFor={props.id}>{props.title}</StCommonLabel>
      <StCommonInput
        id={props.id}
        value={props.value}
        type={props.type}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        onChange={props.onChange}
      />
    </CommonRowBox>
  );
};

export const CommonColumnInput = (props: TypedCommonInput) => {
  return (
    <CommonColumnBox>
      <StCommonLabel htmlFor={props.id}>{props.title}</StCommonLabel>
      <StCommonInput
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

export const StCommonLabel = styled.label<StyledCommonType>`
  font-size: 1.5rem;
  font-weight: 500;
  width: ${(props) => props.width || "30%"};
`;

const StCommonInput = styled.input`
  border: 2px solid #d9d9d9;
  border-radius: 0.25rem;
  outline: none;
  padding: 0.25rem;
  font-size: 1rem;
  &:focus {
    border: 2px solid #58a6dc;
  }
  width: 70%;
`;
