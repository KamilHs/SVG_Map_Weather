import { SET_IS_SIDEBAR_CLOSING, SidebarActionTypes, ISidebarState, SET_DESCRIPTIONS, FetchStatus, SET_FETCH_STATUS } from "./const";

const initialState: ISidebarState = {
    isSidebarClosing: false,
    fetchStatus: FetchStatus.none,
    descriptions: null
}

export const sidebarReducer = (state: ISidebarState = initialState, action: SidebarActionTypes): ISidebarState => {
    switch (action.type) {
        case SET_IS_SIDEBAR_CLOSING:
            return {
                ...state,
                isSidebarClosing: action.payload
            }
        case SET_DESCRIPTIONS:
            return {
                ...state,
                fetchStatus: FetchStatus.success,
                descriptions: action.payload
            }
        case SET_FETCH_STATUS:
            return {
                ...state,
                fetchStatus: action.payload
            }
        default:
            return state;
    }
}

