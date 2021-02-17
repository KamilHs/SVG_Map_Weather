import { SET_IS_SIDEBAR_CLOSING, SidebarActionTypes, ISidebarState, SET_DESCRIPTIONS, FetchStatus, SET_FETCH_STATUS, SET_RECORDS, FormState, SET_FORM_STATE } from "./const";

const initialState: ISidebarState = {
    records: null,
    editedRecord: null,
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
            return {
                ...state,
                formState: action.payload
            }
        default:
            return state;
    }
}

