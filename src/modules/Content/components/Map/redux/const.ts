export const SET_SELECTED_REGION = "SET_SELECTED_REGION";
export const SET_IS_ANIMATING = "SET_IS_ANIMATING";

export interface IRegion {
    element: SVGPathElement;
    title: string;
    iso: string;
}

interface ISetIsAnimating {
    type: typeof SET_IS_ANIMATING;
    payload: boolean;
}

interface ISetSelectedRegion {
    type: typeof SET_SELECTED_REGION;
    payload: IRegion | null;
}

export type MapActionTypes = ISetIsAnimating | ISetSelectedRegion;


export interface IMapState {
    selectedRegion: IRegion | null,
    isAnimating: boolean
}