import { StatusDTO } from "../../dto/StatusDTO";

export interface StatusTokenRequest {
    readonly token: string,
    readonly status: StatusDTO,
}