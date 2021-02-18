import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../../../store";
import { sidebarActions } from "../../components/redux/actions";
import { FormState } from "../redux/const";

import "./index.css";

const mapStateToProps = (state: RootState) => {
    return {
        validationErrors: state.sidebar.validationErrors,
        formSubmissionStatus: state.sidebar.formSubmissionStatus,
        selectedRegionIso: state.map.selectedRegion?.iso,
        formState: state.sidebar.formState,
        weatherDescriptions: state.sidebar.descriptions?.weather_descs || [],
        temperatureDescriptions: state.sidebar.descriptions?.temp_descs || []
    }
}

const mapDispatch = {
    setFormState: sidebarActions.setFormState,
    createRecord: sidebarActions.createRecord,
    setValidationErrors: sidebarActions.setValidationErrors,
    fetchRecordsByIso: sidebarActions.fetchRecordsByIso,
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

interface IFields {
    date: string;
    temperature: string;
    pressure: string;
    wind: string;
    humidity: string;
    temp_desc: string;
    weather_desc: string;
}

const Form: React.FC<Props> = ({
    formState,
    selectedRegionIso,
    validationErrors,
    temperatureDescriptions,
    weatherDescriptions,
    formSubmissionStatus,
    setFormState,
    createRecord,
    fetchRecordsByIso }) => {
    const formRef = React.useRef<HTMLDivElement>(null);
    const initialValues: IFields = React.useMemo(() => ({
        date: "",
        temperature: "",
        pressure: "",
        wind: "",
        humidity: "",
        temp_desc: temperatureDescriptions[0].temp_desc_id,
        weather_desc: weatherDescriptions[0].weather_desc_id
    }), [temperatureDescriptions, weatherDescriptions]);
    const [values, setValues] = React.useState<IFields>({ ...initialValues });

    const transitionEndHandler = React.useCallback(() => {
        if (!formRef.current) return;
        if (formState === FormState.none ||
            formState === FormState.create ||
            formState === FormState.edit) return;
        setValues({ ...initialValues });
        setFormState(FormState.none);
    }, [formState, initialValues, setFormState]);

    const submitHandler = React.useCallback((e: React.FormEvent) => {
        if (!selectedRegionIso) return;
        e.preventDefault();
        createRecord({
            ...values,
            city: selectedRegionIso
        })
    }, [values, selectedRegionIso, createRecord]);

    React.useEffect(() => {
        if (formSubmissionStatus) {
            setValues({ ...initialValues })
        }
    }, [formSubmissionStatus, initialValues, setValues])

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

    React.useEffect(() => {
        if (formSubmissionStatus && selectedRegionIso) {
            fetchRecordsByIso(selectedRegionIso);
        }
    }, [fetchRecordsByIso, formSubmissionStatus, selectedRegionIso])

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
                    <span className="form__info">{
                        formSubmissionStatus && ((formState === FormState.create || formState === FormState.closingCreate)
                            ? "Created successfully"
                            : (formState === FormState.edit || formState === FormState.closingEdit) && "Edited successfully")}</span>
                    <span className="form__error" id="record-error">{formSubmissionStatus === false && "Something went wrong"}</span>
                    <span className="form__error" id="city-error">{validationErrors.city}</span>
                    <PropertyFormGroup
                        name="date"
                        label="Date"
                        type="datetime-local"
                        error={validationErrors.date}
                        value={values.date}
                        onChange={e => setValues({ ...values, date: e.target.value })} />
                    <div className="d-flex flex-column flex-md-row">
                        <PropertyFormGroup
                            name="temperature"
                            label="Temperature"
                            unit="°C"
                            type="number"
                            error={validationErrors.temperature}
                            value={values.temperature}
                            onChange={e => setValues({ ...values, temperature: e.target.value })}
                            halfWidth />
                        <PropertyFormGroup
                            name="pressure"
                            label="Pressure"
                            unit="mb"
                            type="number"
                            error={validationErrors.pressure}
                            value={values.pressure}
                            onChange={e => setValues({ ...values, pressure: e.target.value })}
                            halfWidth />
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <PropertyFormGroup
                            name="wind"
                            label="Wind Speed"
                            unit="km/h"
                            type="number"
                            error={validationErrors.wind}
                            value={values.wind}
                            onChange={e => setValues({ ...values, wind: e.target.value })}
                            halfWidth />
                        <PropertyFormGroup
                            name="humidity"
                            label="Humidity"
                            unit="%"
                            type="number"
                            error={validationErrors.humidity}
                            value={values.humidity}
                            onChange={e => setValues({ ...values, humidity: e.target.value })}
                            halfWidth />
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="temp_desc" className="form__label">Temperature Description</label>
                                <span className="form__error" id="temp_desc-error">{validationErrors.temp_desc}</span>
                            </div>
                            <select
                                defaultValue={values.temp_desc}
                                onChange={e => setValues({ ...values, temp_desc: e.target.value })}
                                name="temp_desc"
                                id="temp_desc"
                                className="form__input">
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
                            <select
                                defaultValue={values.weather_desc}
                                onChange={e => setValues({ ...values, weather_desc: e.target.value })}
                                name="weather_desc"
                                id="weather_desc"
                                className="form__input">
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