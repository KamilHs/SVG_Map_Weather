import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../../../store";
import { sidebarActions } from "../../components/redux/actions";
import { FormState } from "../redux/const";

import "./index.css";

const mapStateToProps = (state: RootState) => {
    return {
        validationErrors: state.sidebar.validationErrors,
        selectedRegionIso: state.map.selectedRegion?.iso || "",
        formState: state.sidebar.formState,
        weatherDescriptions: state.sidebar.descriptions?.weather_descs || [],
        temperatureDescriptions: state.sidebar.descriptions?.temp_descs || []
    }
}

const mapDispatch = {
    setFormState: sidebarActions.setFormState,
    createRecord: sidebarActions.createRecord,
}

const connector = connect(mapStateToProps, mapDispatch);

type PropsRedux = ConnectedProps<typeof connector>
type Props = PropsRedux;

const PropertyFormGroup: React.FC<{
    label: string,
    name: string,
    value: string,
    unit?: string,
    type?: string,
    error?: string | null,
    halfWidth?: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ label, name, unit, halfWidth = false, type = "text", value, error, onChange }) => {
    return (
        <div className={`form__group ${halfWidth && "w-100 w-md-50"}`}>
            <div className="d-flex justify-content-between align-items-center">
                <label htmlFor={name} className="form__label">{label} {unit}</label>
                <span className="form__error" id={`${name}-error`}>{error}</span>
            </div>
            <input
                autoComplete="off"
                name={name}
                id={name}
                value={value}
                type={type}
                step={type === "number" ? "0.01" : ""}
                onChange={onChange}
                className="form__input" />
        </div>
    )
}

const Form: React.FC<Props> = ({
    formState,
    selectedRegionIso,
    validationErrors,
    temperatureDescriptions,
    weatherDescriptions,
    setFormState,
    createRecord }) => {
    const formRef = React.useRef<HTMLDivElement>(null);
    const [temperature, setTemperature] = React.useState<string>("");
    const [pressure, setPressure] = React.useState<string>("");
    const [wind, setWind] = React.useState<string>("");
    const [humidity, setHumidity] = React.useState<string>("");
    const [date, setDate] = React.useState<string>("");
    const [weatherDescription, setWeatherDescription] = React.useState<string>("");
    const [temperatureDescription, setTemperatureDescription] = React.useState<string>("");

    const transitionEndHandler = React.useCallback(() => {
        if (!formRef.current) return;
        if (formState === FormState.none ||
            formState === FormState.create ||
            formState === FormState.edit) return;
        setFormState(FormState.none);
    }, [formState, setFormState]);

    const submitHandler = React.useCallback((e: React.FormEvent) => {
        e.preventDefault();
        createRecord({
            temperature,
            pressure,
            wind,
            humidity,
            date,
            weather_desc: weatherDescription,
            temp_desc: temperatureDescription,
            city: selectedRegionIso
        })
    }, [temperature, pressure, wind, humidity, date, weatherDescription, temperatureDescription, selectedRegionIso, createRecord]);

    React.useEffect(() => {
        let div = formRef.current;
        if (div) {
            div.addEventListener("transitionend", transitionEndHandler);
        }
        return () => {
            if (div) {
                div.removeEventListener("transitionend", transitionEndHandler);
            }
        }
    }, [transitionEndHandler]);

    return (
        <div ref={formRef} className={`form-section ${formState === FormState.create || formState === FormState.edit
            ? "form-section_opened"
            : (formState === FormState.closingCreate || formState === FormState.closingEdit
                ? "form-section_closing"
                : "form-section_hidden")}
                `}>
            <div className="d-flex justify-content-center w-100">
                <h2 className="form-title">{
                    formState === FormState.create || formState === FormState.closingCreate
                        ? "Create "
                        : (formState === FormState.edit || formState === FormState.closingEdit
                            ? "Edit"
                            : "")
                }Data</h2>
            </div>
            <div className="form-container">
                <form onSubmit={submitHandler} className="record-form" action="#">
                    <span className="form__info"></span>
                    <span className="form__error" id="record-error"></span>
                    <span className="form__error" id="city-error">{validationErrors.city}</span>
                    <PropertyFormGroup
                        name="date"
                        label="Date"
                        type="datetime-local"
                        error={validationErrors.date}
                        value={date}
                        onChange={e => setDate(e.target.value)} />
                    <div className="d-flex flex-column flex-md-row">
                        <PropertyFormGroup
                            name="temperature"
                            label="Temperature"
                            unit="°C"
                            type="number"
                            error={validationErrors.temperature}
                            value={temperature}
                            onChange={e => setTemperature(e.target.value)}
                            halfWidth />
                        <PropertyFormGroup
                            name="pressure"
                            label="Pressure"
                            unit="mb"
                            type="number"
                            error={validationErrors.pressure}
                            value={pressure}
                            onChange={e => setPressure(e.target.value)}
                            halfWidth />
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <PropertyFormGroup
                            name="wind"
                            label="Wind Speed"
                            unit="km/h"
                            type="number"
                            error={validationErrors.wind}
                            value={wind}
                            onChange={e => setWind(e.target.value)}
                            halfWidth />
                        <PropertyFormGroup
                            name="humidity"
                            label="Humidity"
                            unit="%"
                            type="number"
                            error={validationErrors.humidity}
                            value={humidity}
                            onChange={e => setHumidity(e.target.value)}
                            halfWidth />
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="temp_desc" className="form__label">Temperature Description</label>
                                <span className="form__error" id="temp_desc-error">{validationErrors.temp_desc}</span>
                            </div>
                            <select defaultValue={temperatureDescription} onChange={e => setTemperatureDescription(e.target.value)} name="temp_desc" id="temp_desc" className="form__input">
                                {temperatureDescriptions.map(tempDesc => (
                                    <option
                                        key={tempDesc.temp_desc_id}
                                        value={tempDesc.temp_desc_id}
                                    >{tempDesc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="weather_desc" className="form__label">Weather Description</label>
                                <span className="form__error" id="weather_desc-error">{validationErrors.weather_desc}</span>
                            </div>
                            <select defaultValue={weatherDescription} onChange={e => setWeatherDescription(e.target.value)} name="weather_desc" id="weather_desc" className="form__input">
                                {weatherDescriptions.map(weatherDesc => (
                                    <option
                                        key={weatherDesc.weather_desc_id}
                                        value={weatherDesc.weather_desc_id}
                                    >{weatherDesc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="form__button" type="submit">{
                            formState === FormState.create || formState === FormState.closingCreate
                                ? "Create "
                                : (formState === FormState.edit || formState === FormState.closingEdit
                                    ? "Edit"
                                    : "")
                        }Data</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default connector(Form);