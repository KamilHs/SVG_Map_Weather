import React from "react";

import { Preloader } from "..";
import { IRecord } from "../redux/const";

interface IProps {
    record: IRecord;
    weatherImg: string;
    optionsImg: string;
    showPreloader?: boolean;
    documentClickHandler: (
        optionsRef: React.RefObject<HTMLDivElement>,
        confirmationRef: React.RefObject<HTMLDivElement>,
    ) => void;
    deleteOptionClickHandler: (
        confirmationRef: React.RefObject<HTMLDivElement>,
        e: React.MouseEvent<HTMLElement>
    ) => void;
    deleteCancelClickHandler: (
        confirmationRef: React.RefObject<HTMLDivElement>,
        e: React.MouseEvent<HTMLElement>
    ) => void;
    triggerClickHandler: (
        optionsRef: React.RefObject<HTMLDivElement>,
        confirmationRef: React.RefObject<HTMLDivElement>,
        e: React.MouseEvent<HTMLElement>
    ) => void;
    editOptionClickHandler: (record: IRecord) => void;
    deleteConfirmClickHandler: (record_id: IRecord["record_id"]) => void;
}

const RecordPropertyInfo: React.FC<{ label: string, value: string, unit?: string }> = ({ label, value, unit = "" }) => {
    return (
        <div className="record-info__item">
            <p className="record-info__property">{label}:</p>
            <p className="record-info__unit">{value}{unit}</p>
        </div>
    )
}

export const Record: React.FC<IProps> = ({
    record,
    weatherImg,
    optionsImg,
    showPreloader = false,
    documentClickHandler,
    triggerClickHandler,
    editOptionClickHandler,
    deleteOptionClickHandler,
    deleteCancelClickHandler,
    deleteConfirmClickHandler }) => {
    const optionsRef = React.useRef<HTMLDivElement>(null);
    const confirmationRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!optionsRef.current) return;
        const bindedHandler = documentClickHandler.bind(null, optionsRef, confirmationRef);
        document.addEventListener("click", bindedHandler);

        return () => {
            document.removeEventListener("click", bindedHandler);
        }
    }, [documentClickHandler]);


    let recordDate = record.date.split(" ");

    return (
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-5" >
            <div className="record">
                <div className="record__inner">
                    <div ref={confirmationRef} onClick={deleteOptionClickHandler.bind(null, confirmationRef)} className="delete-confirmation">
                        <button onClick={deleteCancelClickHandler.bind(null, confirmationRef)} className="cancel-delete">Cancel</button>
                        <button onClick={deleteConfirmClickHandler.bind(null, record.record_id)} className="confirm-delete">Delete</button>
                        {showPreloader && <Preloader />}
                    </div>
                    <div className="record__inner-content" >
                        <div className="record__image">
                            <img draggable="false" src={`../${weatherImg}`} alt={record.weather_desc_name} />
                        </div>
                        <div className="record__overlay">
                            <p
                                className={`record__temperature ${+record.temperature < 0
                                    ? "record__temperature_negative"
                                    : ""}`}
                            >
                                {Math.abs(+record.temperature)}
                            </p>
                            <p className="record__date">{recordDate[0]}</p>
                            <p className="record__time">{recordDate[1].slice(0, -3)}</p>
                        </div>
                        <div className="record__options">
                            <div onClick={triggerClickHandler.bind(null, optionsRef, confirmationRef)} className="record__options-trigger">
                                <img draggable="false" src={optionsImg} alt="options" />
                            </div>
                            <div onClick={triggerClickHandler.bind(null, optionsRef, confirmationRef)} ref={optionsRef} className="record__controllers">
                                <button onClick={editOptionClickHandler.bind(null, record)} className='record__controller record__controller_edit'>Edit</button>
                                <button onClick={deleteOptionClickHandler.bind(null, confirmationRef)} className='record__controller record__controller_delete'>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="record__outer">
                    <div className="record__info">
                        <RecordPropertyInfo
                            label="Wind Speed"
                            unit="km/h"
                            value={record.wind_speed}
                        />
                        <RecordPropertyInfo
                            label="Pressure"
                            unit="mb"
                            value={record.pressure}
                        />
                        <RecordPropertyInfo
                            label="Humidity"
                            unit="%"
                            value={record.humidity}
                        />
                        <RecordPropertyInfo
                            label="Description"
                            value={record.temp_desc_name}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

