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
  currentpassword?: string;
  storename?: string;

  constructor(
    email: string,
    password?: string,
    passwordcheck?: string,
    currentpassword?: string,
    storename?: string
  ) {
    this.email = email;
    this.password = password;
    this.passwordcheck = passwordcheck;
    this.currentpassword = currentpassword;
    this.storename = storename;
  }
}

export class UserData {
  isentered: boolean;
  name: string;
  tel: string;
  adult: number;
  child: number;
  pet?: boolean;
  separate?: boolean;
  custom1?: boolean;
  custom2?: boolean;
  custom3?: boolean;
  createdAt?: number;
  uid?: string;

  constructor(
    isentered: boolean,
    name: string,
    tel: string,
    adult: number,
    child: number,
    pet: boolean,
    seperate: boolean,
    custom1?: boolean,
    custom2?: boolean,
    custom3?: boolean,
    createdAt?: number,
    uid?: string
  ) {
    this.isentered = isentered;
    this.name = name;
    this.tel = tel;
    this.adult = adult;
    this.child = child;
    this.pet = pet;
    this.separate = seperate;
    this.custom1 = custom1;
    this.custom2 = custom2;
    this.custom3 = custom3;
    this.createdAt = createdAt;
    this.uid = uid;
  }
}

export type StoreOption = {
  uid: string;
  storeName: string;
  storebg: string;
  waitingState: boolean;
  maximumTeamMemberCount: number;
  maximumWaitingTeamCount: number;
  petAllow: boolean;
  teamSeparate: boolean;
  customOption1Name: string;
  customOption1State: boolean;
  customOption2Name: string;
  customOption2State: boolean;
  customOption3Name: string;
  customOption3State: boolean;
  firstSetting: boolean;
};

// export class StoreOption {
//   uid: string;
//   storeName: string;
//   storeId: string;
//   storebg: string;
//   waitingState: boolean;
//   maximumTeamMemberCount: number;
//   maximumWaitingTeamCount: number;
//   petAllow: boolean;
//   teamSeparate: boolean;
//   customOption1Name: string;
//   customOption1State: boolean;
//   customOption2Name: string;
//   customOption2State: boolean;
//   customOption3Name: string;
//   customOption3State: boolean;

//   constructor(
//     uid: string,
//     storeName: string,
//     storeId: string,
//     storebg: string,
//     waitingState: boolean,
//     maximumTeamMemberCount: number,
//     maximumWaitingTeamCount: number,
//     petAllow: boolean,
//     teamSeparate: boolean,
//     customOption1Name: string,
//     customOption1State: boolean,
//     customOption2Name: string,
//     customOption2State: boolean,
//     customOption3Name: string,
//     customOption3State: boolean
//   ) {
//     this.uid = uid;
//     this.storeName = storeName;
//     this.storeId = storeId;
//     this.storebg = storebg;
//     this.waitingState = waitingState;
//     this.maximumTeamMemberCount = maximumTeamMemberCount;
//     this.maximumWaitingTeamCount = maximumWaitingTeamCount;
//     this.petAllow = petAllow;
//     this.teamSeparate = teamSeparate;
//     this.customOption1Name = customOption1Name;
//     this.customOption1State = customOption1State;
//     this.customOption2Name = customOption2Name;
//     this.customOption2State = customOption2State;
//     this.customOption3Name = customOption3Name;
//     this.customOption3State = customOption3State;
//   }
// }

export type EventObject = {
  id: string;
  value?: string;
};
