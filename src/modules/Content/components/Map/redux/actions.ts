import { SET_SELECTED_REGION, SET_IS_ANIMATING, MapActionTypes, IRegion } from "./const";

export const mapActions = {
    setIsAnimating: (isAnimating: boolean): MapActionTypes => ({
        type: SET_IS_ANIMATING,
        payload: isAnimating
    }),
    setSelectedRegion: (region: IRegion | null): MapActionTypes => ({
        type: SET_SELECTED_REGION,
        payload: region
    })
}