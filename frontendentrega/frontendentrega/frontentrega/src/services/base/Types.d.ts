export type RequestFilters = {
    [key: string]: (string | number | boolean) | (string | number | boolean)[];
};

export type RequestHeaders = {
    [key: string]: string;
};

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type TableTotal = {
    id: string;
    value: string[];
};

export type BaseResponse<Model> = {
    success: boolean;
    data?: Model;
    rows?: Model[];
    count?: number;
    total?: TableTotal[];
    msg: string;
};

export type QueryParams = {
    rowsPerPage?: number;
    page?: number;
    searchText?: string;
    order?: 'asc' | 'desc';
    orderBy?: string;
    filters?: RequestFilters;
    rows?: Tablemodel[];
    count?:number;
};

export type UploadResponseModel = {
    msg: string;
    file: string;
    name: string;
    path: string;
};
