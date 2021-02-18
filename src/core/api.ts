import axios from "./axios";
import { AxiosResponse } from "axios"
import { ICreateFormData, IFetchDescriptionsResult, IValidationError, IRecord } from "../modules/Sidebar/components/redux/const";

export interface IError {
    error: number;
}

export interface ISuccess {
    success: boolean
}

const api = {
    getDescriptions: (): Promise<AxiosResponse<IFetchDescriptionsResult | IError>> => (
        axios.get<IFetchDescriptionsResult | IError>("/")
    ),
    getRecordsByIso: (iso: string): Promise<AxiosResponse<IRecord[] | IError>> => (
        axios.get<IRecord[] | IError>(`?iso=${iso}`)
    ),
    postCreateRecord: (data: ICreateFormData): Promise<AxiosResponse<ISuccess | IValidationError | IError>> => (
        axios.post<ISuccess | IValidationError | IError>("/", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    )
}

export default api;