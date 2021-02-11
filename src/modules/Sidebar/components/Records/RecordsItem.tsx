import React from "react";

import { IRecord } from "../redux/const";

interface IProps {
    record: IRecord;
    weatherImg: string;
    optionsImg: string
}

const RecordPropertyInfo: React.FC<{ label: string, value: string, unit?: string }> = ({ label, value, unit = "" }) => {
    return (
        <div className="record-info__item">
            <p className="record-info__property">{label}:</p>
            <p className="record-info__unit">{value}{unit}</p>
        </div>
    )
}

export const Record: React.FC<IProps> = ({ record, weatherImg, optionsImg }) => {
    let recordDate = record.date.split(" ");
    return (
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-5" >
            <div className="record">
                <div className="record__inner">
                    <div className="delete-confirmation">
                        <button className="cancel-delete">Cancel</button>
                        <form className="delete-form" action="#">
                            <input autoComplete="off" type="hidden" name="record" value={record.record_id} />
                            <button className="confirm-delete">Delete</button>
                        </form>
                    </div>
                    <div className="record__inner-content" >
                        <div className="record__image">
                            <img draggable="false" src={`../${weatherImg}`} alt={record.weather_name} />
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
                            <div className="record__options-trigger">
                                <img draggable="false" src={optionsImg} alt="options" />
                            </div>
                            <div className="record__controllers">
                                <button className='record__controller record__controller_edit'>Edit</button>
                                <button className='record__controller record__controller_delete'>Delete</button>
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
                            value={record.temp_name}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}