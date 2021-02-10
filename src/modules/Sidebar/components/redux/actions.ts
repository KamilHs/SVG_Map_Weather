import { SET_IS_SIDEBAR_CLOSING, SidebarActionTypes } from "./const";

export const sidebarActions = {
    setIsSidebarClosing: (isSidebarClosing: boolean): SidebarActionTypes => ({
        type: SET_IS_SIDEBAR_CLOSING,
        payload: isSidebarClosing
    })
}