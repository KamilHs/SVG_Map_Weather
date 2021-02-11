import axios from "./axios";
import { AxiosResponse } from "axios"
import { IFetchDescriptionsResult, IRecord } from "../modules/Sidebar/components/redux/const";

export interface IError {
    error: number;
}

const api = {
    getDescriptions: (): Promise<AxiosResponse<IFetchDescriptionsResult | IError>> => axios.get<IFetchDescriptionsResult | IError>("/"),
    getRecordsByIso: (iso: string): Promise<AxiosResponse<IRecord[] | IError>> => axios.get<IRecord[] | IError>(`?iso=${iso}`),
}

export default api;