import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../../../store";
import { DeleteRecordStatus, IRecord } from "../redux/const";
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
    return {
        recordIdToBeDeleted: state.sidebar.recordIdToBeDeleted,
        deleteRecordStatus: state.sidebar.deleteRecordStatus,
        records: state.sidebar.records,
        selectedRegionIso: state.map.selectedRegion?.iso,
    }
}

const mapDispatch = {
    setEditRecord: sidebarActions.setEditRecord,
    fetchRecordsByIso: sidebarActions.fetchRecordsByIso,
    deleteRecord: sidebarActions.deleteRecord,
};

const connector = connect(mapStateToProps, mapDispatch);

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux;

const Records: React.FC<Props> = ({
    records,
    recordIdToBeDeleted,
    selectedRegionIso,
    deleteRecordStatus,
    fetchRecordsByIso,
    setEditRecord,
    deleteRecord }) => {
    const selectedRecordRef = React.useRef<{ options: HTMLElement | null, confirmation: HTMLElement | null }>({ options: null, confirmation: null });
    const documentClickHandler = React.useCallback((
        optionsRef: React.RefObject<HTMLDivElement>,
        confirmationRef: React.RefObject<HTMLDivElement>) => {
        if (!optionsRef.current || !confirmationRef.current) return;

        selectedRecordRef.current.options = null;
        selectedRecordRef.current.confirmation = null;
        optionsRef.current.classList.remove("record__controllers_visible");
        confirmationRef.current.classList.remove("delete-confirmation_visible");
    }, []);
    const triggerClickHandler = React.useCallback((
        optionsRef: React.RefObject<HTMLDivElement>,
        confirmationRef: React.RefObject<HTMLDivElement>,
        e: React.MouseEvent<HTMLElement>) => {
        if (!optionsRef.current || !confirmationRef.current) return;

        e.stopPropagation();
        if (selectedRecordRef.current.options) {
            selectedRecordRef.current.options.classList.remove("record__controllers_visible");
        }
        if (selectedRecordRef.current.confirmation) {
            selectedRecordRef.current.confirmation.classList.remove("delete-confirmation_visible");
        }
        if (selectedRecordRef.current.options === optionsRef.current) {
            selectedRecordRef.current.options = null;
            selectedRecordRef.current.confirmation = null;
            return;
        }
        optionsRef.current.classList.add("record__controllers_visible");

        selectedRecordRef.current.options = optionsRef.current;
        selectedRecordRef.current.confirmation = confirmationRef.current;
    }, []);

    const deleteOptionClickHandler = React.useCallback((
        confirmationRef: React.RefObject<HTMLDivElement>,
        e: React.MouseEvent<HTMLElement>) => {
        if (!confirmationRef.current) return;

        e.stopPropagation();
        confirmationRef.current.classList.add("delete-confirmation_visible");
    }, [])
    const deleteCancelClickHandler = React.useCallback((
        confirmationRef: React.RefObject<HTMLDivElement>,
        e: React.MouseEvent<HTMLElement>) => {
        if (!confirmationRef.current) return;

        e.stopPropagation();
        confirmationRef.current.classList.remove("delete-confirmation_visible");
        if (selectedRecordRef.current.options)
            selectedRecordRef.current.options.classList.remove("record__controllers_visible");
        selectedRecordRef.current.confirmation = null;
        selectedRecordRef.current.options = null;
    }, [])

    const editOptionClickHandler = React.useCallback((record: IRecord) => {
        setEditRecord(record);
    }, [setEditRecord])

    const deleteConfirmClickHandler = React.useCallback((record_id: IRecord["record_id"]) => {
        deleteRecord(record_id);
    }, [deleteRecord]);

    React.useEffect(() => {
        if (deleteRecordStatus === DeleteRecordStatus.success && selectedRegionIso) {
            fetchRecordsByIso(selectedRegionIso);
        }
    }, [deleteRecordStatus, selectedRegionIso, fetchRecordsByIso])

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
                            deleteOptionClickHandler={deleteOptionClickHandler}
                            deleteCancelClickHandler={deleteCancelClickHandler}
                            deleteConfirmClickHandler={deleteConfirmClickHandler}
                            showPreloader={recordIdToBeDeleted === record.record_id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default connector(Records);