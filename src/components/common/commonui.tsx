import styled from "styled-components";
import { StyledCommonType } from "../../utils/typealies";

export const CommonColumnBox = styled.div<StyledCommonType>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.justifyContent || "normal"};
  align-items: ${(props) => props.alignItems || "normal"};
  padding: ${(props) => props.padding || "0"};
  margin: ${(props) => props.margin || "0"};
  width: ${(props) => props.width};
  gap: ${(props) => props.gap}};
`;

export const CommonRowBox = styled.div<StyledCommonType>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent || "normal"};
  align-items: ${(props) => props.alignItems || "normal"};
  padding: ${(props) => props.padding || "0"};
  margin: ${(props) => props.margin || "0"};
  width: ${(props) => props.width};
  gap: ${(props) => props.gap}};
`;

export const CommonBorder = styled.div<StyledCommonType>`
  display: block;
  background: #d4d4d4;
  height: 3px;
  border-radius: 1rem;
  box-sizing: border-box;
  margin: 2rem 1rem;
`;

export const CommonBlackBackground = styled.div`
  background: rgba(38, 38, 38, 40%);
  display: block;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 5;
`;
