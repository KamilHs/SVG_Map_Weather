import React from "react";

import SVGMap from "./svg";
import "./index.css";

const Map: React.FC = () => {
    const mapRef = React.useRef<SVGSVGElement | null>(null);
    const boxRef = React.useRef<HTMLDivElement | null>(null);
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

    React.useEffect(() => {
        if (!mapRef.current) return;
        let boxTimeout: ReturnType<typeof setTimeout>;

        mapRef
            .current
            .querySelectorAll("path")
            .forEach(path => {
                path.addEventListener("mousemove", e => {
                    showBox(e.clientX, e.clientY, path)
                });
                path.addEventListener("mouseenter", e => {
                    clearTimeout(boxTimeout);
                    showBox(e.clientX, e.clientY, path);
                });
                path.addEventListener("mouseleave", e => boxTimeout = setTimeout(hideBox, 100));
            });
    }, []);
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

export default Map;