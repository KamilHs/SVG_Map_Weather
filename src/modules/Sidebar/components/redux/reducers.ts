import { SET_DELETE_RECORD_STATUS, SET_IS_SIDEBAR_CLOSING, SidebarActionTypes, ISidebarState, SET_DESCRIPTIONS, FetchStatus, SET_FETCH_STATUS, SET_RECORDS, FormState, SET_FORM_STATE, SET_VALIDATION_ERRORS, SET_FORM_SUBMISSION_STATUS, SET_EDITED_RECORD, DeleteRecordStatus, SET_RECORD_ID_TO_BE_DELETED, FormSubmissionStatus } from "./const";

const initialState: ISidebarState = {
    records: null,
    editedRecord: null,
    validationErrors: {},
    isSidebarClosing: false,
    descriptions: null,
    recordIdToBeDeleted: null,
    formSubmissionStatus: FormSubmissionStatus.none,
    deleteRecordStatus: DeleteRecordStatus.none,
    fetchStatus: FetchStatus.none,
    formState: FormState.none,
}

export const sidebarReducer = (state: ISidebarState = initialState, action: SidebarActionTypes): ISidebarState => {
    switch (action.type) {
        case SET_IS_SIDEBAR_CLOSING:
            return {
                ...state,
                isSidebarClosing: action.payload
            }
        case SET_FETCH_STATUS:
            return {
                ...state,
                fetchStatus: action.payload
            }
        case SET_DESCRIPTIONS:
            return {
                ...state,
                fetchStatus: FetchStatus.success,
                descriptions: action.payload
            }
        case SET_RECORDS:
            return {
                ...state,
                fetchStatus: FetchStatus.success,
                records: action.payload
            }
        case SET_FORM_STATE:
            if (action.payload === FormState.none) {
                return {
                    ...state,
                    validationErrors: {},
                    editedRecord: null,
                    formSubmissionStatus: FormSubmissionStatus.none,
                    formState: action.payload
                }
            }
            return {
                ...state,
                formState: action.payload
            }
        case SET_VALIDATION_ERRORS:
            return {
                ...state,
                validationErrors: action.payload
            }
        case SET_FORM_SUBMISSION_STATUS:
            return {
                ...state,
                formSubmissionStatus: action.payload
            }
        case SET_EDITED_RECORD:
            return {
                ...state,
                formState: action.payload !== null ? FormState.edit : FormState.closingEdit,
                editedRecord: action.payload
            }
        case SET_DELETE_RECORD_STATUS:
            return {
                ...state,
                deleteRecordStatus: action.payload
            }
        case SET_RECORD_ID_TO_BE_DELETED:
            if (action.payload) {
                return {
                    ...state,
                    deleteRecordStatus: DeleteRecordStatus.loading,
                    recordIdToBeDeleted: action.payload
                }
            }
            return {
                ...state,
                deleteRecordStatus: DeleteRecordStatus.success,
                recordIdToBeDeleted: action.payload
            }
        default:
            return state;
    }
}

