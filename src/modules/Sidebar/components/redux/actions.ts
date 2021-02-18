import { ThunkAction } from "redux-thunk";

import api, { IError, ISuccess } from "../../../../core/api";
import { RootState } from "../../../../store";
import { FetchStatus, FormState, ICreateFormData, IFetchDescriptionsResult, IFormError, IRecord, SET_DESCRIPTIONS, SET_EDITED_RECORD, SET_FETCH_STATUS, SET_FORM_ERRORS, SET_FORM_STATE, SET_IS_SIDEBAR_CLOSING, SET_RECORDS, SidebarActionTypes } from "./const";

const isError = (data: IFetchDescriptionsResult | IError | IRecord[]): data is IError => {
    return (data as IError).error !== undefined;
}

const isFormError = (data: IFormError | ISuccess): data is IFormError => {
    return (data as ISuccess).success === undefined
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
    setEditRecord: (editedRecord: IRecord | null): SidebarActionTypes => ({
        type: SET_EDITED_RECORD,
        payload: editedRecord
    }),
    setFormState: (formState: FormState): SidebarActionTypes => ({
        type: SET_FORM_STATE,
        payload: formState
    }),
    setFormErrors: (errors: IFormError): SidebarActionTypes => ({
        type: SET_FORM_ERRORS,
        payload: errors
    }),
    createRecord: (formData: ICreateFormData): ThunkAction<void, RootState, unknown, SidebarActionTypes> => async dispatch => {
        try {
            const { data } = await api.postCreateRecord(formData);

            if (isFormError(data)) {
                dispatch(sidebarActions.setFormErrors(data));
            }
        } catch (err) {
            dispatch(sidebarActions.setFetchStatus(FetchStatus.failure));
        }
    },
    fetchRecordsByIso: (iso: string): ThunkAction<void, RootState, unknown, SidebarActionTypes> => async dispatch => {
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
