import { IRecord } from "../modules/Sidebar/components/redux/const";
import { FilterType } from "../modules/Sidebar/components/Statistics";

export const getDay = (dateString: string) => {
    let date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const getWeek = (dateString: string) => {
    let date = new Date(dateString);
    let nDay = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - nDay + 3);
    let n1stThursday = date.valueOf();
    date.setMonth(0, 1);
    if (date.getDay() !== 4) {
        date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((n1stThursday - +date) / 604800000);
}

const getMonth = (dateString: string) => {
    return new Date(dateString).getMonth() + 1;
}

const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
}

export const groupBy = (records: IRecord[], filter: FilterType) => {
    let func = filter === FilterType.daily
        ? getDay
        : (filter === FilterType.weekly
            ? getWeek
            : (filter === FilterType.monthly
                ? getMonth
                : getYear))

    let filtered = group(records, func);

    for (const key in filtered) {
        const el = filtered[key];

        filtered[key] = el.reduce((res: any, curr: IRecord) => ({
            temperature: res.temperature + +curr.temperature / el.length,
            pressure: res.pressure + +curr.pressure / el.length,
            wind_speed: res.wind_speed + +curr.wind_speed / el.length,
            humidity: res.humidity + +curr.humidity / el.length,
        }), { temperature: 0, pressure: 0, wind_speed: 0, humidity: 0 })
    }
    return filtered;
}

const group = (records: IRecord[], func: ((dateString: string) => string) | ((dateString: string) => number)) => records.reduce(
    (result: { [key: string]: any }, record) => ({
        ...result,
        [func(record.date)]: [
            ...(result[func(record.date)] || []),
            record,
        ],
    }),
    {},
);