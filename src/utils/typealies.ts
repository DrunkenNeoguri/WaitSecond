export type TypedCommonInput = {
  id: string;
  value: string;
  type: string;
  placeholder?: string;
  maxLength?: number;
  onChange?: () => void;
};
