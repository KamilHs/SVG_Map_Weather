import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../../../store";
import { sidebarActions } from "../../components/redux/actions";
import { FormState } from "../redux/const";

import "./index.css";

const mapStateToProps = (state: RootState) => {
    return {
        title: state.map.selectedRegion?.title || null,
        formState: state.sidebar.formState
    }
}

const mapDispatch = {
    setFormState: sidebarActions.setFormState
}

const connector = connect(mapStateToProps, mapDispatch);

type PropsRedux = ConnectedProps<typeof connector>
interface IProps {
    handleClose: () => void;
    opened: boolean;
}

type Props = PropsRedux & IProps;

const Header: React.FC<Props> = ({ title, formState, opened, setFormState, handleClose }) => {
    const handleClick = React.useCallback(() => {
        switch (formState) {
            case FormState.create:
                setFormState(FormState.closingCreate);
                break;
            case FormState.edit:
                setFormState(FormState.closingEdit);
                break;
            case FormState.closingCreate:
                setFormState(FormState.create);
                break;
            case FormState.closingEdit:
                setFormState(FormState.edit);
                break;
            case FormState.none:
                setFormState(FormState.create);
                break;
            default:
                setFormState(FormState.none);
                break;
        }
    }, [formState, setFormState])
    return (
        <div className="d-flex justify-content-between align-items-start w-100 position-relative">
            <div onClick={handleClose} className="close-container">
                <div className="leftright"></div>
                <div className="rightleft"></div>
            </div>
            {opened &&
                <>
                    <h2 className="region-title">{title}</h2>
                    <span
                        className={`crossign ${formState === FormState.create || formState === FormState.edit ? "opened" : ""}`}
                        onClick={handleClick}
                    ></span>
                </>
            }
        </div>
    )
}

export default connector(Header);