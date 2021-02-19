import axios from "./axios";
import { AxiosResponse } from "axios"
import { ICreateFormData, IEditFormData, IFetchDescriptionsResult, IValidationError, IRecord } from "../modules/Sidebar/components/redux/const";

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
    ),
    postEditRecord: (data: IEditFormData): Promise<AxiosResponse<ISuccess | IValidationError | IError>> => (
        axios.post<ISuccess | IValidationError | IError>("/", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    ),
    deleteDeleteRecord: (record_id: IRecord["record_id"]): Promise<AxiosResponse<ISuccess | IError>> => (
        axios.delete<ISuccess | IError>("/", {
            data: {
                record_id
            },
            headers: {
                "Content-Type": "application/json"
            },
        })
    )
}

export default api;