import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface LogoutView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    clearUserInfo: () => void;
}

export class LogoutPresenter {
    private logoutView: LogoutView;
    private userService: UserService;

    constructor(view: LogoutView) {
        this.logoutView = view;
        this.userService = new UserService();
    }

    public async logOut(authToken: AuthToken | null) {
        this.logoutView.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.userService.logout(authToken!);
    
          this.logoutView.clearLastInfoMessage();
          this.logoutView.clearUserInfo();
        } catch (error) {
          this.logoutView.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };
}