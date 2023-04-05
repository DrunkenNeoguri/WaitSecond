import { atom } from "recoil";

export const lowVisionState = atom<boolean>({
  key: "lowvision",
  default: false,
});
