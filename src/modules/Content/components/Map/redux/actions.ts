import { SET_SELECTED_PATH, SET_IS_ANIMATING, MapActionTypes } from "./const";

export const mapActions = {
    setIsAnimating: (isAnimating: boolean): MapActionTypes => ({
        type: SET_IS_ANIMATING,
        payload: isAnimating
    }),
    setSelectedPath: (path: SVGPathElement | null): MapActionTypes => ({
        type: SET_SELECTED_PATH,
        payload: path
    })
}