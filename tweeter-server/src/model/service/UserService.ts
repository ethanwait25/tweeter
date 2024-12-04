import { Buffer } from "buffer";
import { User, FakeData, UserDTO, AuthToken } from "tweeter-shared";
import { AuthTokenDTO } from "tweeter-shared/dist/model/dto/AuthTokenDTO";

export class UserService {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    // Converts back to Uint8Array
    // const uint8Array: Uint8Array = new Uint8Array(Buffer.from(base64String, "base64"));

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDTO | null> {
    let dto = FakeData.instance.findUserByAlias(alias);
    return dto === null ? null : dto.dto;
  };

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
