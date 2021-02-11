import { SET_SELECTED_REGION, SET_IS_ANIMATING, MapActionTypes, IMapState } from "./const";

const initialState: IMapState = {
    selectedRegion: null,
    isAnimating: false
}

export const mapReducer = (state: IMapState = initialState, action: MapActionTypes): IMapState => {
    switch (action.type) {
        case SET_IS_ANIMATING:
            return {
                ...state,
                isAnimating: action.payload
            }

        case SET_SELECTED_REGION:
            return {
                isAnimating: true,
                selectedRegion: action.payload
            }

        default:
            return state;
    }
} 