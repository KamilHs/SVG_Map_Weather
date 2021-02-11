import React from "react";
import { connect, ConnectedProps } from "react-redux";

import SVGMap from "../../../../components/SVGMap";
import { RootState } from "../../../../store";
import { mapActions } from "./redux/actions";
import { calculate } from "../../../../helpers/svgAnimation";
import { sidebarActions } from "../../../Sidebar/components/redux/actions";
import "./index.css";

const mapStateToProps = (state: RootState) => {
    return {
        ...state.map,
        isSidebarClosing: state.sidebar.isSidebarClosing
    };
}
const mapDispatch = {
    setIsAnimating: mapActions.setIsAnimating,
    setSelectedRegion: mapActions.setSelectedRegion,
    setIsSidebarClosing: sidebarActions.setIsSidebarClosing,
    fetchDescriptions: sidebarActions.fetchDescriptions,
    fetchRecordsByIso: sidebarActions.fetchRecordsByIso,

}
const connector = connect(mapStateToProps, mapDispatch);

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux;

interface IAnimationData {
    targetMatrix: number[];
    currentMatrix: number[];
    frame: number;
    requestId: number;
}

const animationConfig = {
    frameCount: 20,
    initialMatrix: [1, 0, 0, 1, 0, 0]
}

let boxTimeout: ReturnType<typeof setTimeout>;
let isFirstTime = true;
let fetchedDescriptions = false;

const Map: React.FC<Props> = ({ selectedRegion, isAnimating, isSidebarClosing, fetchRecordsByIso, setIsAnimating, setSelectedRegion, setIsSidebarClosing, fetchDescriptions }) => {
    const mapRef = React.useRef<SVGSVGElement | null>(null);
    const boxRef = React.useRef<HTMLDivElement | null>(null);
    const animationDataRef = React.useRef<IAnimationData>(
        {
            currentMatrix: [...animationConfig.initialMatrix],
            targetMatrix: [],
            frame: 0,
            requestId: 0
        });

    const showBox = React.useCallback((x: number, y: number, path: SVGPathElement) => {
        if (!boxRef.current) return;
        boxRef.current.style.display = "inline-block";
        boxRef.current.style.left = x + "px";
        boxRef.current.style.top = y + "px";

        let name = boxRef.current.querySelector(".name")
        let iso = boxRef.current.querySelector(".iso")
        if (name && iso) {
            name.textContent = path.getAttribute("name");
            iso.textContent = path.id;
        }
    }, []);

    const hideBox = React.useCallback(() => {
        if (!boxRef.current) return;
        let name = boxRef.current.querySelector(".name");
        let iso = boxRef.current.querySelector(".iso");

        boxRef.current.style.display = "none";
        if (name && iso) {
            name.textContent = null;
            iso.textContent = null;
        }
    }, []);

    const animate = React.useCallback(() => {
        let k = ++animationDataRef.current.frame / animationConfig.frameCount;
        let j = 1 - k;
        let tempMatrix = [];

        for (let i = 0; i < 6; i++) {
            tempMatrix[i] = j * animationDataRef.current.currentMatrix[i] + k * animationDataRef.current.targetMatrix[i];
        }

        if (mapRef.current) {
            mapRef.current.setAttribute("transform", `matrix(${tempMatrix.join(" ")})`);
        }

        if (!(animationDataRef.current.frame % animationConfig.frameCount)) {
            animationDataRef.current.frame = 0;
            cancelAnimationFrame(animationDataRef.current.requestId);
            setIsAnimating(false);
            animationDataRef.current.requestId = 0;
            animationDataRef.current.currentMatrix = [...animationDataRef.current.targetMatrix];
            return;
        }

        animationDataRef.current.requestId = requestAnimationFrame(animate);
    }, [setIsAnimating]);

    const handleClick = React.useCallback((e: MouseEvent) => {
        if (e.target instanceof SVGPathElement && selectedRegion === null) {
            isFirstTime = false;
            let path: SVGPathElement = e.target;
            if (mapRef.current === null) return;
            if (isAnimating) return;

            hideBox();
            setIsSidebarClosing(false);
            setSelectedRegion({
                element: path,
                title: path.getAttribute("name")!,
                iso: path.id
            });
            fetchRecordsByIso(path.id);
        }
    }, [isAnimating, selectedRegion, fetchRecordsByIso, setSelectedRegion, hideBox, setIsSidebarClosing]);

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (e.target instanceof SVGPathElement && !selectedRegion && !isAnimating) {
            showBox(e.clientX, e.clientY, e.target)
        }
    }, [showBox, selectedRegion, isAnimating]);

    const handleMouseEnter = React.useCallback((e: MouseEvent) => {
        if (e.target instanceof SVGPathElement && !selectedRegion && !isAnimating) {
            clearTimeout(boxTimeout);
            showBox(e.clientX, e.clientY, e.target);
        }
    }, [showBox, selectedRegion, isAnimating]);

    const handleMouseLeave = React.useCallback((e: MouseEvent) => {
        boxTimeout = setTimeout(hideBox, 100)
    }, [hideBox]);

    React.useEffect(() => {
        if (!mapRef.current) return;
        mapRef.current.querySelectorAll("path").forEach(path => {
            if (selectedRegion) {
                if (path === selectedRegion.element) {
                    path.classList.add("selected");
                }
                else {
                    path.classList.add("disabled");
                }
            }
            else {
                path.classList.remove("disabled", "selected");
            }
        });
    }, [selectedRegion])

    React.useEffect(() => {
        if (!mapRef.current) return;

        const paths = mapRef.current.querySelectorAll("path");
        paths.forEach((path) => {
            path.addEventListener("click", handleClick)
            path.addEventListener("mousemove", handleMouseMove);
            path.addEventListener("mouseenter", handleMouseEnter);
            path.addEventListener("mouseleave", handleMouseLeave);
        });
        return () => {
            paths.forEach(path => {
                path.removeEventListener("click", handleClick);
                path.removeEventListener("mousemove", handleMouseMove);
                path.removeEventListener("mouseenter", handleMouseEnter);
                path.removeEventListener("mouseleave", handleMouseLeave);
            })
        }
    }, [handleClick, handleMouseMove, handleMouseEnter, handleMouseLeave]);

    React.useEffect(() => {
        if (selectedRegion !== null && mapRef.current !== null) {
            animationDataRef.current.targetMatrix = calculate(mapRef.current, selectedRegion.element);
        }
        else {
            animationDataRef.current.targetMatrix = [...animationConfig.initialMatrix];
        }
        if (animationDataRef
            .current
            .currentMatrix.every((item, i) => (
                item === animationDataRef.current.targetMatrix[i]
            ))) return;

        animate();
    }, [selectedRegion, animate]);

    React.useEffect(() => {
        if (!fetchedDescriptions) {
            fetchedDescriptions = true;
            fetchDescriptions();
        }
    }, [fetchDescriptions])

    return (
        <div
            className={["map", (selectedRegion && !isAnimating && !isSidebarClosing ? "map_shifted" : "")].join(" ")}
        >
            {isFirstTime && <h2 id="tutorial">Click on a region</h2>}
            <div ref={boxRef} className="box">
                <p className="name"></p>
                <p className="iso"></p>
            </div>
            <SVGMap ref={mapRef} />
        </div>
    )
}

export default connector(Map);