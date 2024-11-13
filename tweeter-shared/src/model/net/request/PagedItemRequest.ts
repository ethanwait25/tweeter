import { TokenRequest } from "./TokenRequest";

export interface PagedItemRequest<T> extends TokenRequest {
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: T | null
}