import { UserDTO } from "../../dto/UserDTO";

export interface FollowerStatusRequest {
    readonly token: string,
    readonly user: UserDTO,
    readonly selectedUser: UserDTO
}