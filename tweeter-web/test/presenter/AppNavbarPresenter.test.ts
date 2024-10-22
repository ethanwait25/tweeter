import { LogoutPresenter, LogoutView } from "../../src/presenters/authentication/LogoutPresenter";
import { mock, instance, verify, spy, when, anything, capture } from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarPresenterView: LogoutView;
    let appNavbarPresenter: LogoutPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("token", Date.now());

    beforeEach(() => {
        mockAppNavbarPresenterView = mock<LogoutView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

        const spyAppNavbarPresenter = spy(new LogoutPresenter(mockAppNavbarPresenterViewInstance));
        appNavbarPresenter = instance(spyAppNavbarPresenter);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);
        when(spyAppNavbarPresenter.userService).thenReturn(mockUserServiceInstance);
    });

    test("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    });

    test("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(await mockUserService.logout(authToken)).once();
    });

    test("if the logout succeeds, tells the view to clear the last info message and the user info", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
        verify(mockAppNavbarPresenterView.clearUserInfo()).once();
        verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
    });

    test("if the logout fails, reports error and does not clear info message user info", async () => {
        const error = new Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);

        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarPresenterView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
        verify(mockAppNavbarPresenterView.clearUserInfo()).never();
    });
});