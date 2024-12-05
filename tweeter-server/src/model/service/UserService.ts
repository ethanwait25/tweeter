import { FakeData, UserDTO } from "tweeter-shared";
import { AuthTokenDTO } from "tweeter-shared/dist/model/dto/AuthTokenDTO";
import { DatabaseFactory } from "../dao/DatabaseFactory";

export class UserService {

  private usersDAO;
  private authsDAO;
  private profileImageDAO;

  public constructor(dbfactory: DatabaseFactory) {
    this.usersDAO = dbfactory.createUsersDAO();
    this.authsDAO = dbfactory.createAuthsDAO();
    this.profileImageDAO = dbfactory.createProfileImageDAO();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    const user = await this.usersDAO.getUserWithCredentials(alias, password);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    const authToken = await this.authsDAO.createAuth(alias);
    return [user.dto, authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    const user = await this.usersDAO.createUser(firstName, lastName, alias, password);

    if (user === null) {
      throw new Error("Invalid registration");
    }

    await this.profileImageDAO.uploadImage(alias, userImageBytes, imageFileExtension);

    const authToken = await this.authsDAO.createAuth(alias);
    return [user.dto, authToken.dto];
  }

  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDTO | null> {
    await this.validateToken(token);
    const dto = await this.usersDAO.getUserByAlias(alias);
    return dto === null ? null : dto.dto;
  };

  public async logout(token: string): Promise<void> {
    await this.authsDAO.deleteAuth(token);
  };

  private async validateToken(token: string): Promise<void> {
    const authToken = await this.authsDAO.getAuth(token);
    if (!authToken) {
      throw new Error("Invalid token");
    }
  }
}
