import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "../Presenter";
import { UserService } from "../../model/service/UserService";

export interface AuthenticationView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setIsLoading: (loading: boolean) => void;
  navigate: (url: string) => void;
}

export class AuthenticationPresenter extends Presenter<AuthenticationView> {
  private _service: UserService;

  public constructor(view: AuthenticationView) {
    super(view);
    this._service = new UserService();
  }

  protected get service(): UserService {
    return this._service;
  }

  public async doAuthenticationOperation(
    operation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    navigate: () => void
  ): Promise<void> {
    this.view.setIsLoading(true);
    const [user, authToken] = await operation();
    this.view.updateUserInfo(user, user, authToken, rememberMe);
    navigate();
  }
}
