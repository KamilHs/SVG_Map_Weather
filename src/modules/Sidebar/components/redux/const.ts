export const SET_IS_SIDEBAR_CLOSING = "SET_IS_SIDEBAR_CLOSING";

interface ISetSidebarIsClosing {
    type: typeof SET_IS_SIDEBAR_CLOSING;
    payload: boolean;
}

export type SidebarActionTypes = ISetSidebarIsClosing

export interface ISidebarState{
    isSidebarClosing: boolean;
}