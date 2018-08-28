import { AsyncStorage } from "react-native";

export const USER_KEY = "auth-demo-key";

const FIRST_USER_KEY = "first-user"


export const onSignIn = () => AsyncStorage.setItem(USER_KEY, "true");


export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const firstUser = () => {
  AsyncStorage.setItem(FIRST_USER_KEY, "true")
    .then(() => onSignIn())
};

export const isFirstUser = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(FIRST_USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
