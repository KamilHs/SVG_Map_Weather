import { SET_IS_SIDEBAR_CLOSING, SidebarActionTypes, ISidebarState } from "./const";

const initialState: ISidebarState = {
    isSidebarClosing: false
}

export const sidebarReducer = (state: ISidebarState = initialState, action: SidebarActionTypes): ISidebarState => {
    switch (action.type) {
        case SET_IS_SIDEBAR_CLOSING:
            return {
                ...state,
                isSidebarClosing: action.payload
            }
        default:
            return state;
    }
}

