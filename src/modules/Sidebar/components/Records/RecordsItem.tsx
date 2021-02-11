import React from "react";

import { IRecord } from "../redux/const";

interface IProps {
    record: IRecord;
    weatherImg: string;
    optionsImg: string
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
                            <p className="record__temperature">{record.temperature}</p>
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
                        <div className="record-info__item">
                            <p className="record-info__property">Wind Speed:</p>
                            <p className="record-info__unit">{record.wind_speed}km/h</p>
                        </div>
                        <div className="record-info__item">
                            <p className="record-info__property">Pressure:</p>
                            <p className="record-info__unit">{record.pressure}mb</p>
                        </div>
                        <div className="record-info__item">
                            <p className="record-info__property">Humidity:</p>
                            <p className="record-info__unit">{record.humidity}%</p>
                        </div>
                        <div className="record-info__item">
                            <p className="record-info__property">Description:</p>
                            <p className="record-info__unit">{record.temp_name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}