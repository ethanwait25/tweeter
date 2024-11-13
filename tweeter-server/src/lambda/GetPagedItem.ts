// import { PagedItemRequest, PagedItemResponse } from "tweeter-shared";

// type ServiceFunction<T> = {
//     serviceFunction: () => Promise<[T[], boolean]>;
// }

// export const getPagedItems = async <T, J>(
//   serviceFunction: () => Promise<[T[], boolean]>,
//   serviceConstructor: new () => J
// ): Promise<PagedItemResponse<T>> => {
//     const service = new serviceConstructor();
//     const [items, hasMore] = await service.serviceFunction();
//     return { 
//         success: true,
//         message: null,
//         items: items,
//         hasMore: hasMore
//     };
// };
