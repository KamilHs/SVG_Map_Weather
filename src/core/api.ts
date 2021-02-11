import axios from "./axios";
import { AxiosResponse } from "axios"
import { IFetchDescriptionsResult } from "../modules/Sidebar/components/redux/const";

export interface IError {
    error: number;
}

const api = {
    getDescriptions: (): Promise<AxiosResponse<IFetchDescriptionsResult | IError>> => axios.get<IFetchDescriptionsResult | IError>("/"),
}

export default api;