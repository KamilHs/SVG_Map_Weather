import { SET_SELECTED_PATH, SET_IS_ANIMATING, MapActionTypes, IMapState } from "./const";

const initialState: IMapState = {
    selectedPath: null,
    isAnimating: false
}

export const mapReducer = (state: IMapState = initialState, action: MapActionTypes): IMapState => {
    switch (action.type) {
        case SET_IS_ANIMATING:
            return {
                ...state,
                isAnimating: action.payload
            }

        case SET_SELECTED_PATH:
            return {
                isAnimating: true,
                selectedPath: action.payload
            }

        default:
            return state;
    }
} 