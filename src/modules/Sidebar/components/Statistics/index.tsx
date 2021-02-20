import React from "react";
import { Line } from "react-chartjs-2"
import { ChartData } from "chart.js"

import { IRecord } from "../redux/const";
import { formatDate } from "../../../../helpers/formatDate";
import { groupBy, getDay } from "../../../../helpers/groupByDate";
import "./index.css";

export enum FilterType {
    daily,
    weekly,
    monthly,
    yearly
}

interface IFilter {
    label: string;
    id: string;
    type: FilterType;
}

const filters: IFilter[] = [
    {
        label: "Daily",
        id: "daily_filter",
        type: FilterType.daily
    },
    {
        label: "Weekly",
        id: "weekly_filter",
        type: FilterType.weekly
    },
    {
        label: "Monthly",
        id: "monthly_filter",
        type: FilterType.monthly
    },
    {
        label: "Yearly",
        id: "yearly_filter",
        type: FilterType.yearly
    },
]

const charts = [
    {
        name: "temperature",
        label: "Temperature",
    },
    {
        name: "pressure",
        label: "Pressure",
    },
    {
        name: "wind_speed",
        label: "Wind Speed",
    },
    {
        name: "humidity",
        label: "Humidity",
    },
]

const StatsFilter: React.FC<{
    label: string;
    id: string;
    type: FilterType;
    onChange: (type: FilterType) => void;
    checked?: boolean
}> = ({ label, id, type, onChange, checked = false }) => {
    return (
        <div className="form__group py-1 w-50 w-sm-50">
            <div className="form-check">
                <input onChange={e => onChange(type)} className="form-check-input stats_filter" type="radio" name="stats_filter" id={id} checked={checked} />
                <label className="form-check-label form__label" htmlFor={id}>{label}</label>
            </div>
        </div>
    )
}

interface IProps {
    records: IRecord[]
}

const Statistics: React.FC<IProps> = ({ records }) => {
    const [intervalDates, setIntervalDates] = React.useState<{ from: string, to: string }>({
        from: records[records.length - 1].date,
        to: records[0].date
    })
    const [filter, setFilter] = React.useState<FilterType>(FilterType.daily);
    const data: ChartData[] = React.useMemo(() => {
        let start = +new Date(getDay(intervalDates.from));
        let end = +new Date(getDay(intervalDates.to));
        let filtered = groupBy(records.filter(record => {
            let date = + new Date(getDay(record.date));
            return date >= start && date <= end
        }).reverse(), filter);

        const entries = Object.entries(filtered);
        const bgColors = new Array(entries.length).fill("rgb(255,0,0)");
        return charts.map(chart => ({
            labels: entries.map(entry => entry[0]),
            datasets: [{
                label: chart.label,
                data: entries.map(entry => entry[1][chart.name]),
                backgroundColor: bgColors,
                fill: false,
                borderWidth: 2,
                borderColor: [
                    "rgb(0,0,255)"
                ]
            }],
        } as ChartData
        ))
    }, [records, filter, intervalDates])
    return (
        <div className="stats">
            <div className="container-fluid h-100">
                <div className="row justify-content-center h-100">
                    <div className="col-12">
                        <form action="#" id="stats-form">
                            <div className="d-flex flex-column flex-md-row">
                                <div className="form__group w-100 w-md-50">
                                    <div className="d-flex flex-column">
                                        <span className="form__error" id="from-date-error"></span>
                                        <label htmlFor="from-date" className="form__label">From Date</label>
                                    </div>
                                    <input onChange={e => setIntervalDates({ ...intervalDates, from: e.target.value })} autoComplete="off" name="from-date" id="from-date" type="datetime-local" value={formatDate(intervalDates.from)} className="form__input stats_date-input" />
                                </div>
                                <div className="form__group w-100 w-md-50">
                                    <div className="d-flex flex-column">
                                        <span className="form__error" id="to-date-error"></span>
                                        <label htmlFor="to-date" className="form__label">To Date</label>
                                    </div>
                                    <input onChange={e => setIntervalDates({ ...intervalDates, to: e.target.value })} autoComplete="off" name="to-date" id="to-date" type="datetime-local" value={formatDate(intervalDates.to)} className="form__input stats_date-input" />
                                </div>
                            </div>
                            <div className="d-flex flex-wrap">
                                {filters.map(({ label, id, type }) => (
                                    <StatsFilter
                                        key={id}
                                        id={id}
                                        label={label}
                                        type={type}
                                        onChange={setFilter}
                                        checked={type === filter} />
                                ))}
                            </div>
                        </form>
                        <div className="data-info">
                            <p className="data-info__item number_of_records"></p>
                            <div className="d-flex justify-content-between h-100 flex-wrap">
                                <div>
                                    <p className="data-info__item max-temperature"></p>
                                    <p className="data-info__item min-temperature"></p>
                                </div>
                                <div>
                                    <p className="data-info__item max-wind_speed"></p>
                                    <p className="data-info__item min-wind_speed"></p>
                                </div>
                                <div>
                                    <p className="data-info__item max-pressure"></p>
                                    <p className="data-info__item min-pressure"></p>
                                </div>
                                <div>
                                    <p className="data-info__item max-humidity"></p>
                                    <p className="data-info__item min-humidity"></p>
                                </div>
                            </div>
                        </div>
                        <div className="charts">
                            {
                                charts.map((chart, index) => (
                                    <div key={Math.random() * (index + 1)} className="chart">
                                        <Line
                                            data={data[index]}
                                            options={
                                                {
                                                    title: {
                                                        display: true,
                                                        text: `${chart.label} during the period`,
                                                        fontSize: 16
                                                    },
                                                    scales: {
                                                        yAxes: [{
                                                            ticks: {
                                                                beginAtZero: true
                                                            }
                                                        }],
                                                    },
                                                }
                                            } />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics;