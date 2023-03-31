import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./firestore.setting";

export const loginStateCheck = () => {
  const sessionKey = `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`;
  const loginState = sessionStorage.getItem(sessionKey);

  if (loginState === null) {
    return false;
  } else {
    return JSON.parse(loginState).uid;
  }
};

export const tokenExpirationCheck = async () => {
  const firebaseAuth = getAuth();
  const expirationCheck = await firebaseAuth.currentUser
    ?.getIdTokenResult()
    .then((token) => {
      const expirationTime: number = new Date(token.expirationTime).getTime();
      const nowTime: number = new Date().getTime();

      if (nowTime >= expirationTime) {
        const sessionKey = `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`;
        sessionStorage.removeItem(sessionKey);
        return true;
      } else {
        firebaseAuth.currentUser?.getIdToken(true);
        return false;
      }
    });
  if (expirationCheck === undefined) {
    return false;
  }
  return expirationCheck;
};
