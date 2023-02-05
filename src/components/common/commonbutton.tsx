import styled from "styled-components";
import { StyledButtonType, TypedCommonButton } from "../../utils/typealies";

const CommonButton = (props: TypedCommonButton) => {
  return (
    <StButton
      type={props.type}
      onClick={props.onClick}
      value={props.value}
      padding={props?.padding}
      margin={props?.margin}
      border={props?.border}
      background={props?.background}
      fontSize={props?.fontSize}
      borderRadius={props?.borderRadius}
      color={props?.color}
    >
      {props.children}
    </StButton>
  );
};

export default CommonButton;

const StButton = styled.button<StyledButtonType>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize || "1rem"};
  width: ${(props) => props.width || "100%"};
  background: ${(props) => props.background};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  border: ${(props) => props.border || "none"};
  border-radius: ${(props) => props.borderRadius || "none"};
  outline: none;
  cursor: pointer;
`;
