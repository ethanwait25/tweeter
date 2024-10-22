import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(
    post: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.statusService.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);

        this.view.clearLastInfoMessage();
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }

  public clearPost() {
    this.view.setPost("");
  }
}
