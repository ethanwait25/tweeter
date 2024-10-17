import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  private originalUrl: string | undefined;

  public constructor(
    view: AuthenticationView,
    originalUrl: string | undefined
  ) {
    super(view);
    this.originalUrl = originalUrl;
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    this.doFailureReportingOperation(
      async () => {
        this.doAuthenticationOperation(
          async () => {
            return await this.service.login(alias, password);
          },
          rememberMe,
          () => {
            if (this.originalUrl) {
              this.view.navigate(this.originalUrl);
            } else {
              this.view.navigate("/");
            }
          }
        );
      },
      "log user in",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
