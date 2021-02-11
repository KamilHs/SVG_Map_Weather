import React from "react";

import "./index.css";

interface IProps {
    overlay?: boolean
}

const Preloader: React.FC<IProps> = ({ overlay = false }) => {
    return (
        <div className={overlay ? "preloader_overlay" : ""}>
            <div className="preloader">
                <div className="loader">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>
            </div>
        </div>
    );
}

export default Preloader;