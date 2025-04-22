export type TGenericApiResponse<T> = {
    statusCode: number;
    data: T;
}

export type TGenericApiResponseMessage = {
    statusCode: number;
    message: string;
}

export type TGenericApiResponseArray<T> = {
    statusCode: number;
    data: T[];
}

export type TGenericApiResponseMessageArray = {
    statusCode: number;
    message: string[];
}


