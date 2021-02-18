import axios from "./axios";
import { AxiosResponse } from "axios"
import { ICreateFormData, IFetchDescriptionsResult, IFormError, IRecord } from "../modules/Sidebar/components/redux/const";

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
    postCreateRecord: (data: ICreateFormData): Promise<AxiosResponse<ISuccess | IFormError>> => (
        axios.post<ISuccess | IFormError>("/", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    )
}

export default api;