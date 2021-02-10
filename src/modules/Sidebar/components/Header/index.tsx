import React from "react";

import { FormType } from "../../";
import "./index.css";

interface IProps {
    handleClose: () => void;
    title: string | FormType | null;
    opened: boolean;
}

const Header: React.FC<IProps> = ({ title, handleClose, opened }) => {
    return (
        <div className="d-flex justify-content-between align-items-center w-100">
            <div onClick={handleClose} className="close-container">
                <div className="leftright"></div>
                <div className="rightleft"></div>
            </div>
            {opened &&
                <>
                    <h2 className="region-title">{title}</h2>
                    <span className="crossign"></span>
                </>
            }
        </div>
    )
}

export default Header;