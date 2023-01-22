import styled from "styled-components";
import { StyledButtonType, TypedCommonButton } from "../../utils/typealies";

const CommonButton = (props: TypedCommonButton) => {
  return (
    <STButton
      type={props.type}
      onClick={props.onClick}
      value={props.value}
      padding={props.style?.padding}
      margin={props.style?.padding}
      border={props.style?.padding}
    ></STButton>
  );
};

export default CommonButton;

const STButton = styled.button<StyledButtonType>`
  padding: ${(props) => props.padding || "0"};
  margin: ${(props) => props.margin || "0"};
  border: ${(props) => props.border || "none"};
  outline: none;
`;
