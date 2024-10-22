import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { anything, instance, mock, verify } from "ts-mockito";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUser = new User("alias", "name", "email", "password");
  const mockAuthToken = new AuthToken("token", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockAuthToken,
    });
  });

  test("starts with both post and clear buttons disabled", () => {
    const { postButton, clearButton } = getRenderedPostStatusElements();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  test("enables both buttons when the text field is filled", async () => {
    const { postButton, clearButton, textField, user } =
      getRenderedPostStatusElements();
    await user.type(textField, "post");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  test("disables both buttons if the text field is cleared", async () => {
    const { postButton, clearButton, textField, user } =
      getRenderedPostStatusElements();
    await user.type(textField, "post");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.click(clearButton);

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  test("calls the presenter's postStatus method with correct parameters when the post button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const { postButton, textField, user } = getRenderedPostStatusElements(
      mockPresenterInstance
    );

    await user.type(textField, "post");
    await user.click(postButton);

    verify(mockPresenter.submitPost(anything(), anything(), anything())).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <PostStatus presenter={presenter} />
      ) : (
        <PostStatus />
      )}
    </MemoryRouter>
  );
};

const getRenderedPostStatusElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByLabelText(/Status Update/i);

  return { postButton, clearButton, textField, user };
};
