export type TypedCommonInput = {
  id: string;
  value: string;
  type: string;
  placeholder?: string;
  maxLength?: number;
  onChange?: () => void;
};

export type TypedCommonButton = {
  type: "button" | "submit" | "reset";
  onClick: () => void;
  value?: string;
  style?: {
    padding?: string;
    margin?: string;
    border?: string;
  };
};

export type StyledButtonType = {
  border?: string;
  padding?: string;
  margin?: string;
};

export type StyledCommonType = {
  justifyContent?:
    | "normal"
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?:
    | "normal"
    | "center"
    | "flex-start"
    | "flex-end"
    | "stretch"
    | "baseline";
  padding?: string;
  margin?: string;
};
