import React from "react";

import "./index.css";

const Form: React.FC = () => {
    return (
        <div className="form-section form-section_hidden">
            <div className="d-flex justify-content-center w-100">
                <h2 className="form-title">Add Data</h2>
            </div>
            <div className="form-container">
                <form className="record-form" action="#">
                    <span className="form__info"></span>
                    <span className="form__error" id="record-error"></span>
                    <span className="form__error" id="city-error"></span>
                    <div className="form__group">
                        <div className="d-flex justify-content-between align-items-center">
                            <label htmlFor="date" className="form__label">Date</label>
                            <span className="form__error" id="date-error"></span>
                        </div>
                        <input autoComplete="off" name="date" id="date" type="datetime-local" className="form__input" />
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="temperature" className="form__label">Temperature °C</label>
                                <span className="form__error" id="temperature-error"></span>
                            </div>
                            <input autoComplete="off" name="temperature" id="temperature" type="text" className="form__input" />
                        </div>
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="pressure" className="form__label">Pressure mb</label>
                                <span className="form__error" id="pressure-error"></span>
                            </div>
                            <input autoComplete="off" name="pressure" id="pressure" type="text" className="form__input" />
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="wind" className="form__label">Wind Speed km/h</label>
                                <span className="form__error" id="wind-error"></span>
                            </div>
                            <input autoComplete="off" name="wind" id="wind" type="text" className="form__input" />
                        </div>
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="humidity" className="form__label">Humidity %</label>
                                <span className="form__error" id="humidity-error"></span>
                            </div>
                            <input autoComplete="off" name="humidity" id="humidity" type="text" className="form__input" />
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-md-row">
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="temp_desc" className="form__label">Temperature Description</label>
                                <span className="form__error" id="temp_desc-error"></span>
                            </div>
                            <select name="temp_desc" id="temp_desc" className="form__input"></select>
                        </div>
                        <div className="form__group w-100 w-md-50">
                            <div className="d-flex justify-content-between align-items-center">
                                <label htmlFor="weather_desc" className="form__label">Weather Description</label>
                                <span className="form__error" id="weather_desc-error"></span>
                            </div>
                            <select name="weather_desc" id="weather_desc" className="form__input"></select>
                        </div>
                    </div>
                    <input autoComplete="off" type="hidden" name="city" id="city" />
                    <input autoComplete="off" type="hidden" name="record" id="record" />
                    <div className="d-flex justify-content-center">
                        <button className="form__button" type="button">Add data</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form;