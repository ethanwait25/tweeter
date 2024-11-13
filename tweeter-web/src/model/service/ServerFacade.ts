import {
    PagedItemRequest,
    PagedItemResponse,
    User,
    UserDTO
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  import { URL } from "../../../serverconfig.json";
  
  export class ServerFacade {
    private SERVER_URL = URL;
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
    public async getMoreFollowees(
      request: PagedItemRequest<UserDTO>
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedItemRequest<UserDTO>,
        PagedItemResponse<UserDTO>
      >(request, "/followee/list");
  
      // Convert the UserDTO array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDTO(dto) as User)
          : null;
  
      // Handle errors
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }
  }