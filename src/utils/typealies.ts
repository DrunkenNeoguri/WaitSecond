// common UI type

export type TypedCommonInput = {
  id: string;
  value: string;
  type: string;
  title: string;
  placeholder?: string;
  maxLength?: number;
  direction?: "row" | "column";
  justify?: string;
  align?: string;
  margin?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  labelWidth?: string;
  inputWidth?: string;
  onChange: (e: React.ChangeEvent) => void;
};

// feature type

export type Props = {
  children?: React.ReactNode;
  page?: "user" | "admin";
};

export class AdminData {
  email: string;
  password?: string;
  passwordcheck?: string;

  constructor(email: string, password?: string, passwordcheck?: string) {
    this.email = email;
    this.password = password;
    this.passwordcheck = passwordcheck;
  }
}

export class UserData {
  name: string;
  tel: string;
  member: number;
  child?: boolean;
  pet?: boolean;

  constructor(
    name: string,
    tel: string,
    member: number,
    child: boolean,
    pet: boolean
  ) {
    this.name = name;
    this.tel = tel;
    this.member = member;
    this.child = child;
    this.pet = pet;
  }
}

export type EventObject = {
  id: string;
  value?: string;
};
