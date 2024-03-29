export interface IProductItem {
    id?: number | undefined;
    name: string,
    price: string,
    description: string,
    quantity: number,
    images: string[],
    categoryId: number,
}

export interface IProductData {
    list: IProductItem[],
    pageIndex: number,
    pageSize: number,
    totalCount: number,
    totalPages: number
}

export interface IProductSearch{
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    quantity?: number,
    minQuantity?: number,
    maxQuantity?: number,
    description?: string,
    page: number,
    pageSize: number,
    categoryId?: number,
}