import React from "react";

import { IRecord } from "../redux/const";
import { Record } from "./RecordsItem";

import cloudly from "../../../../imgs/weather/cloudly.png";
import rainy from "../../../../imgs/weather/rainy.png";
import windy from "../../../../imgs/weather/windy.png";
import snowy from "../../../../imgs/weather/snowy.png";
import sunny from "../../../../imgs/weather/sunny.png";
import options from "../../../../imgs/options.svg";
import "./index.css";

const imgs = {
    cloudly,
    rainy,
    windy,
    snowy,
    sunny,
}


interface IProps {
    records: IRecord[],
}

const Records: React.FC<IProps> = ({ records }) => {
    return (
        <div className="records">
            <div className="container-fluid h-100">
                <div className="row h-100">
                    {records.map(record => (
                        <Record
                            key={record.record_id}
                            record={record}
                            weatherImg={imgs[record.weather_name as never]}
                            optionsImg={options}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Records;