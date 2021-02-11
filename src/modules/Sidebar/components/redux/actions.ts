import { ThunkAction } from "redux-thunk";

import api, { IError } from "../../../../core/api";
import { RootState } from "../../../../store";
import { FetchStatus, IFetchDescriptionsResult, IRecord, SET_DESCRIPTIONS, SET_FETCH_STATUS, SET_IS_SIDEBAR_CLOSING, SET_RECORDS, SidebarActionTypes } from "./const";

const isError = (data: IFetchDescriptionsResult | IError | IRecord[]): data is IError => {
    return (data as IError).error !== undefined;
}

export const sidebarActions = {
    setIsSidebarClosing: (isSidebarClosing: boolean): SidebarActionTypes => ({
        type: SET_IS_SIDEBAR_CLOSING,
        payload: isSidebarClosing
    }),
    setFetchStatus: (fetchStatus: FetchStatus): SidebarActionTypes => ({
        type: SET_FETCH_STATUS,
        payload: fetchStatus
    }),
    setDescription: (descriptions: IFetchDescriptionsResult): SidebarActionTypes => ({
        type: SET_DESCRIPTIONS,
        payload: descriptions
    }),
    setRecords: (records: IRecord[] | null): SidebarActionTypes => ({
        type: SET_RECORDS,
        payload: records
    }),
    fetchRecordsByIso: (iso: string): ThunkAction<void, RootState, unknown, SidebarActionTypes> => async (dispatch) => {
        dispatch(sidebarActions.setFetchStatus(FetchStatus.loading));
        try {
            const { data } = await api.getRecordsByIso(iso);

            if (isError(data)) {
                throw new Error("Internal Error 500");
            }
            dispatch(sidebarActions.setRecords(data));
        } catch (err) {
            dispatch(sidebarActions.setFetchStatus(FetchStatus.failure));
        }
    },
    fetchDescriptions: (): ThunkAction<void, RootState, unknown, SidebarActionTypes> => async (dispatch) => {
        dispatch(sidebarActions.setFetchStatus(FetchStatus.loading));
        try {
            const { data } = await api.getDescriptions();

            if (isError(data)) {
                throw new Error("Internal Error 500");
            }
            dispatch(sidebarActions.setDescription(data));
        } catch (err) {
            dispatch(sidebarActions.setFetchStatus(FetchStatus.failure));
        }
    }
}
