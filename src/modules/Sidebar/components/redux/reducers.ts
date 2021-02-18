import { SET_IS_SIDEBAR_CLOSING, SidebarActionTypes, ISidebarState, SET_DESCRIPTIONS, FetchStatus, SET_FETCH_STATUS, SET_RECORDS, FormState, SET_FORM_STATE, SET_VALIDATION_ERRORS, SET_FORM_SUBMISSION_STATUS } from "./const";

const initialState: ISidebarState = {
    records: null,
    editedRecord: null,
    formSubmissionStatus: null,
    validationErrors: {},
    isSidebarClosing: false,
    fetchStatus: FetchStatus.none,
    descriptions: null,
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
                    formSubmissionStatus: null,
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
        default:
            return state;
    }
}

