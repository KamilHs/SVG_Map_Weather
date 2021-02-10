export const SET_SELECTED_PATH = "SET_SELECTED_PATH";
export const SET_IS_ANIMATING = "SET_IS_ANIMATING";

interface ISetIsAnimating {
    type: typeof SET_IS_ANIMATING;
    payload: boolean;
}

interface ISetSelectedPath {
    type: typeof SET_SELECTED_PATH;
    payload: SVGPathElement | null;
}

export type MapActionTypes = ISetIsAnimating | ISetSelectedPath;


export interface IMapState {
    selectedPath: SVGPathElement | null,
    isAnimating: boolean
}