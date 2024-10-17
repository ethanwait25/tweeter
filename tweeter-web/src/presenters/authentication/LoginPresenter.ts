import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";

export interface LoginView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setIsLoading: (loading: boolean) => void;
  navigate: (url: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService: UserService;
  private originalUrl: string | undefined;

  public constructor(view: LoginView, originalUrl: string | undefined) {
    super(view);
    this.userService = new UserService();
    this.originalUrl = originalUrl;
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.userService.login(alias, password);

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (this.originalUrl) {
          this.view.navigate(this.originalUrl);
        } else {
          this.view.navigate("/");
        }
      },
      "log user in",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
