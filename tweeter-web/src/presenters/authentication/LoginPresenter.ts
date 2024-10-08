import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface LoginView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter {
  private userService: UserService;
  private loginView: LoginView;
  private originalUrl: string | undefined;

  public constructor(view: LoginView, originalUrl: string | undefined) {
    this.loginView = view;
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    try {
      this.loginView.setIsLoading(true);

      const [user, authToken] = await this.userService.login(alias, password);

      this.loginView.updateUserInfo(user, user, authToken, rememberMe);

      if (this.originalUrl) {
        this.loginView.navigate(this.originalUrl);
      } else {
        this.loginView.navigate("/");
      }
    } catch (error) {
      this.loginView.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.loginView.setIsLoading(false);
    }
  }
}
