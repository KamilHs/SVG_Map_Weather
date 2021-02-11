export const SET_IS_SIDEBAR_CLOSING = "SET_IS_SIDEBAR_CLOSING";
export const SET_DESCRIPTIONS = "SET_DESCRIPTIONS";
export const SET_FETCH_STATUS = "SET_FETCH_STATUS";
export const SET_RECORDS = "SET_RECORDS";

export enum FetchStatus {
    loading,
    success,
    failure,
    none
}

export interface IRecord {
    date: string;
    humidity: string;
    pressure: string;
    record_id: string;
    temp_name: string;
    temperature: string;
    weather_name: string;
    wind_speed: string;
}

export interface ITemperatureDescription {
    temp_desc_id: string,
    name: string,
}

export interface IWeatherDescription {
    weather_desc_id: string,
    name: string,
}

export interface IFetchDescriptionsResult {
    temp_descs: ITemperatureDescription[];
    weather_descs: IWeatherDescription[];
}

interface ISetDescriptions {
    type: typeof SET_DESCRIPTIONS;
    payload: IFetchDescriptionsResult;
}

interface ISetSidebarIsClosing {
    type: typeof SET_IS_SIDEBAR_CLOSING;
    payload: boolean;
}

interface ISetFetchStatus {
    type: typeof SET_FETCH_STATUS;
    payload: FetchStatus
}

interface ISetRecords {
    type: typeof SET_RECORDS;
    payload: IRecord[] | null
}

export type SidebarActionTypes = ISetSidebarIsClosing | ISetDescriptions | ISetFetchStatus | ISetRecords;

export interface ISidebarState {
    records: IRecord[] | null;
    isSidebarClosing: boolean;
    fetchStatus: FetchStatus;
    descriptions: IFetchDescriptionsResult | null;
}