import useToastListener from "./toaster/ToastListenerHook";
import useUserInfo from "./userInfo/UserInfoHook";
import { useState } from "react";
import { UserNavigationPresenter, UserNavigationView } from "../presenters/UserNavigationPresenter";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: UserNavigationView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  }

  const [presenter] = useState(new UserNavigationPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event, authToken, currentUser);
  }
  
  return {
    navigateToUser,
  };
};

export default useUserNavigation;
