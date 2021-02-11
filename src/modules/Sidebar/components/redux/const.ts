export const SET_IS_SIDEBAR_CLOSING = "SET_IS_SIDEBAR_CLOSING";
export const SET_DESCRIPTIONS = "SET_DESCRIPTIONS";
export const SET_FETCH_STATUS = "SET_FETCH_STATUS";

export enum FetchStatus {
    loading,
    success,
    failure,
    none
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

export type SidebarActionTypes = ISetSidebarIsClosing | ISetDescriptions | ISetFetchStatus;

export interface ISidebarState {
    isSidebarClosing: boolean;
    fetchStatus: FetchStatus;
    descriptions: IFetchDescriptionsResult | null;
}