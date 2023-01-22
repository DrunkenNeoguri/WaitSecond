import styled from "styled-components";
import { StyledCommonType } from "../../utils/typealies";

export const CommonColumnBox = styled.div<StyledCommonType>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.justifyContent || "normal"};
  align-items: ${(props) => props.alignItems || "normal"};
  padding: ${(props) => props.padding || "0"};
  margin: ${(props) => props.margin || "0"};
`;

export const CommonRowBox = styled.div<StyledCommonType>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent || "normal"};
  align-items: ${(props) => props.alignItems || "normal"};
  padding: ${(props) => props.padding || "0"};
  margin: ${(props) => props.margin || "0"};
`;
