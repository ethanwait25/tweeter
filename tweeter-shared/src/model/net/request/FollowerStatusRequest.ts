import { UserDTO } from "../../dto/UserDTO";
import { TokenRequest } from "./TokenRequest";

export interface FollowerStatusRequest extends TokenRequest {
    readonly user: UserDTO,
    readonly selectedUser: UserDTO
}