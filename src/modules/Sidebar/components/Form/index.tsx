import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { formatDate } from "../../../../helpers/formatDate";

import { RootState } from "../../../../store";
import { sidebarActions } from "../../components/redux/actions";
import { FormState, FormSubmissionStatus } from "../redux/const";

import "./index.css";

const mapStateToProps = (state: RootState) => {
    return {
        validationErrors: state.sidebar.validationErrors,
        editedRecord: state.sidebar.editedRecord,
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
    editRecord: sidebarActions.editRecord,
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
    temp_desc_id: string;
    weather_desc_id: string;
    temp_desc_name: string;
    weather_desc_name: string;
}

const Form: React.FC<Props> = ({
    formState,
    selectedRegionIso,
    validationErrors,
    temperatureDescriptions,
    weatherDescriptions,
    formSubmissionStatus,
    editedRecord,
    setFormState,
    createRecord,
    editRecord,
    fetchRecordsByIso }) => {
    const formRef = React.useRef<HTMLDivElement>(null);
    const initialValues: IFields = React.useMemo(() => {
        return {
            date: editedRecord?.date || "",
            temperature: editedRecord?.temperature || "",
            pressure: editedRecord?.pressure || "",
            wind: editedRecord?.wind_speed || "",
            humidity: editedRecord?.humidity || "",
            temp_desc_id: editedRecord?.temp_desc_id || temperatureDescriptions[0].temp_desc_id,
            weather_desc_id: editedRecord?.weather_desc_id || weatherDescriptions[0].weather_desc_id,
            temp_desc_name: editedRecord?.temp_desc_name || temperatureDescriptions[0].name,
            weather_desc_name: editedRecord?.weather_desc_name || weatherDescriptions[0].name,
        }
    }, [temperatureDescriptions, weatherDescriptions, editedRecord]);

    const [values, setValues] = React.useState<IFields>({ ...initialValues });

    const transitionEndHandler = React.useCallback(() => {
        if (!formRef.current) return;
        if (formState === FormState.none ||
            formState === FormState.create ||
            formState === FormState.edit) return;
        setFormState(FormState.none);
        setValues({ ...initialValues });
    }, [formState, initialValues, setFormState]);

    const submitHandler = React.useCallback((e: React.FormEvent) => {
        if (!selectedRegionIso) return;
        e.preventDefault();
        if (formState === FormState.edit && editedRecord) {
            editRecord({
                ...values,
                record_id: editedRecord.record_id,
                city: selectedRegionIso
            })
        }
        else {
            createRecord({
                ...values,
                city: selectedRegionIso
            })
        }
    }, [values, selectedRegionIso, formState, editedRecord, createRecord, editRecord]);

    React.useEffect(() => {
        if (editedRecord && formSubmissionStatus === FormSubmissionStatus.success) return;
        setValues({ ...initialValues })
    }, [editedRecord, formSubmissionStatus, initialValues, setValues])

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
        if (selectedRegionIso && formSubmissionStatus === FormSubmissionStatus.success) {
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
                            ? "Edit "
                            : "")
                }Data</h2>
            </div>
            <div className="form-container">
                <form onSubmit={submitHandler} className="record-form" action="#">
                    <span className="form__info">{
                        formSubmissionStatus === FormSubmissionStatus.success && ((formState === FormState.create || formState === FormState.closingCreate)
                            ? "Created successfully"
                            : (formState === FormState.edit || formState === FormState.closingEdit) && "Edited successfully")}</span>
                    <span className="form__error" id="record-error">{formSubmissionStatus === FormSubmissionStatus.failure && "Something went wrong"}</span>
                    <span className="form__error" id="city-error">{validationErrors.city}</span>
                    <PropertyFormGroup
                        name="date"
                        label="Date"
                        type="datetime-local"
                        error={validationErrors.date}
                        value={(values.date && formatDate(values.date)) || ""}
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
                                <label htmlFor="temp_desc_id" className="form__label">Temperature Description</label>
                                <span className="form__error" id="temp_desc-error">{validationErrors.temp_desc_id}</span>
                            </div>
                            <select
                                value={values.temp_desc_id}
                                onChange={e => setValues({ ...values, temp_desc_id: e.target.value })}
                                name="temp_desc_id"
                                id="temp_desc_id"
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
                                <label htmlFor="weather_desc_id" className="form__label">Weather Description</label>
                                <span className="form__error" id="weather_desc-error">{validationErrors.weather_desc_id}</span>
                            </div>
                            <select
                                value={values.weather_desc_id}
                                onChange={e => setValues({ ...values, weather_desc_id: e.target.value })}
                                name="weather_desc_id"
                                id="weather_desc_id"
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
                                    ? "Edit "
                                    : "")
                        }Data</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default connector(Form);