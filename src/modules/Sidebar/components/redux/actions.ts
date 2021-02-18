import { ThunkAction } from "redux-thunk";

import api, { IError, ISuccess } from "../../../../core/api";
import { RootState } from "../../../../store";
import { FetchStatus, FormState, ICreateFormData, IFetchDescriptionsResult, IValidationError, IRecord, SET_DESCRIPTIONS, SET_EDITED_RECORD, SET_FETCH_STATUS, SET_VALIDATION_ERRORS, SET_FORM_STATE, SET_IS_SIDEBAR_CLOSING, SET_RECORDS, SidebarActionTypes, SET_FORM_SUBMISSION_STATUS } from "./const";

const isError = (data: IFetchDescriptionsResult | IError | IRecord[] | IValidationError | ISuccess): data is IError => {
    return (data as IError).error !== undefined;
}

const isFormError = (data: IValidationError | ISuccess | IError): data is IValidationError => {
    return ((data as ISuccess).success === undefined &&
        (data as IError).error === undefined
    )
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
    setValidationErrors: (errors: IValidationError): SidebarActionTypes => ({
        type: SET_VALIDATION_ERRORS,
        payload: errors
    }),
    setFormSubmissionStatus: (status: boolean | null): SidebarActionTypes => ({
        type: SET_FORM_SUBMISSION_STATUS,
        payload: status
    }),
    createRecord: (formData: ICreateFormData): ThunkAction<void, RootState, unknown, SidebarActionTypes> => async dispatch => {
        try {
            const { data } = await api.postCreateRecord(formData);

            if (isFormError(data)) {
                return dispatch(sidebarActions.setValidationErrors(data));
            }
            if (isError(data)) {
                return dispatch(sidebarActions.setFormSubmissionStatus(false))
            }
            dispatch(sidebarActions.setFormSubmissionStatus(data.success));
        } catch (err) {
            dispatch(sidebarActions.setFormSubmissionStatus(false));
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
