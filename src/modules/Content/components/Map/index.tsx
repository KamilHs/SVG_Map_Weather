import React from "react";
import { connect, ConnectedProps } from "react-redux";

import SVGMap from "../../../../components/SVGMap";
import { RootState } from "../../../../store";
import "./index.css";
import { mapActions } from "./redux/actions";
import { calculate } from "../../../../helpers/svgAnimation";

const mapStateToProps = (state: RootState) => {
    return { ...state.map };
}
const mapDispatch = {
    setIsAnimating: mapActions.setIsAnimating,
    setSelectedPath: mapActions.setSelectedPath
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

const Map: React.FC<Props> = ({ selectedPath, isAnimating, setIsAnimating, setSelectedPath }) => {
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
            if (selectedPath !== null) {
                // Render Sidebar
            }
            return;
        }

        animationDataRef.current.requestId = requestAnimationFrame(animate);
    }, [selectedPath, setIsAnimating]);

    const handleClick = React.useCallback((e: MouseEvent) => {
        if (e.target instanceof SVGPathElement) {
            let path: SVGPathElement = e.target;
            if (mapRef.current === null) return;
            if (isAnimating) return;
            if (selectedPath && path !== selectedPath) return;

            path.classList.toggle("selected");
            mapRef.current.querySelectorAll("path").forEach(p => p !== path && p.classList.toggle("disabled"))
            if (path === selectedPath) {
                setSelectedPath(null);
            }
            else {
                setSelectedPath(path);
            }
        }
    }, [isAnimating, setSelectedPath, selectedPath]);

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (e.target instanceof SVGPathElement) {
            showBox(e.clientX, e.clientY, e.target)
        }
    }, [showBox]);

    const handleMouseEnter = React.useCallback((e: MouseEvent) => {
        if (e.target instanceof SVGPathElement) {
            clearTimeout(boxTimeout);
            showBox(e.clientX, e.clientY, e.target);
        }
    }, [showBox]);

    const handleMouseLeave = React.useCallback((e: MouseEvent) => {
        boxTimeout = setTimeout(hideBox, 100)
    }, [hideBox]);

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
        if (selectedPath !== null && mapRef.current !== null) {
            animationDataRef.current.targetMatrix = calculate(mapRef.current, selectedPath);
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
    }, [selectedPath, animate]);

    return (
        <div className="map">
            <div ref={boxRef} className="box">
                <p className="name"></p>
                <p className="iso"></p>
            </div>
            <SVGMap ref={mapRef} />
        </div>
    )
}

export default connector(Map);