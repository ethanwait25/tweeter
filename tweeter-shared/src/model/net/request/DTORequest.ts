import { TokenRequest } from "./TokenRequest";

export interface DTORequest<T> extends TokenRequest {
    readonly dto: T;
}