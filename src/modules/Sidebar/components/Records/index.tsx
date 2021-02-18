import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../../../store";
import { IRecord } from "../redux/const";
import { Record } from "./RecordsItem";

import cloudly from "../../../../imgs/weather/cloudly.png";
import rainy from "../../../../imgs/weather/rainy.png";
import windy from "../../../../imgs/weather/windy.png";
import snowy from "../../../../imgs/weather/snowy.png";
import sunny from "../../../../imgs/weather/sunny.png";
import options from "../../../../imgs/options.svg";
import "./index.css";
import { sidebarActions } from "../redux/actions";

const imgs = {
    cloudly,
    rainy,
    windy,
    snowy,
    sunny,
}

const mapStateToProps = (state: RootState) => {
    return { records: state.sidebar.records }
}

const mapDispatch = {
    setEditRecord: sidebarActions.setEditRecord
};

const connector = connect(mapStateToProps, mapDispatch);

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux;

const Records: React.FC<Props> = ({ records, setEditRecord }) => {
    const selectedRecordRef = React.useRef<HTMLElement | null>(null);
    const documentClickHandler = React.useCallback((ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;

        selectedRecordRef.current = null;
        ref.current.classList.remove("record__controllers_visible");
    }, []);
    const triggerClickHandler = React.useCallback((ref: React.RefObject<HTMLDivElement>, e: React.MouseEvent<HTMLElement>) => {
        if (!ref.current) return;

        e.stopPropagation();
        if (selectedRecordRef.current)
            selectedRecordRef.current.classList.remove("record__controllers_visible");
        if (selectedRecordRef.current === ref.current) {
            selectedRecordRef.current = null;
            return;
        }
        ref.current.classList.add("record__controllers_visible");

        selectedRecordRef.current = ref.current;
    }, []);

    const editOptionClickHandler = React.useCallback((record: IRecord) => {
        setEditRecord(record);
    }, [setEditRecord])

    return (
        <div className="records">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {records && records.map(record => (
                        <Record
                            key={record.record_id}
                            record={record}
                            weatherImg={imgs[record.weather_desc_name as never]}
                            optionsImg={options}
                            documentClickHandler={documentClickHandler}
                            triggerClickHandler={triggerClickHandler}
                            editOptionClickHandler={editOptionClickHandler}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default connector(Records);