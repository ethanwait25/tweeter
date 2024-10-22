import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/authentication/LoginPresenter";
import { anything, instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  test("starts with the sign-in button disabled", () => {
    const { signInButton } = getRenderedLoginElements("/");
    expect(signInButton).toBeDisabled();
  });

  test("enables the sign-in button when the alias and password fields are filled", async () => {
    const { signInButton, aliasField, passwordField, user } =
      getRenderedLoginElements("/");
    await initializeFields(aliasField, passwordField, user);
    expect(signInButton).toBeEnabled();
  });

  test("disables the sign-in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      getRenderedLoginElements("/");
    await initializeFields(aliasField, passwordField, user);
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "alias");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  test("calls the presenter's login method when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const alias = "alias";
    const password = "password";

    const { signInButton, aliasField, passwordField, user } =
      getRenderedLoginElements("/", mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);
    verify(mockPresenter.doLogin(alias, password, anything())).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const getRenderedLoginElements = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};

const initializeFields = async (
  aliasField: HTMLElement,
  passwordField: HTMLElement,
  user: UserEvent
) => {
  await user.type(aliasField, "alias");
  await user.type(passwordField, "password");
};
