export const SET_IS_SIDEBAR_CLOSING = "SET_IS_SIDEBAR_CLOSING";
export const SET_DESCRIPTIONS = "SET_DESCRIPTIONS";
export const SET_FETCH_STATUS = "SET_FETCH_STATUS";
export const SET_RECORDS = "SET_RECORDS";
export const CREATE_RECORD = "CREATE_RECORD";
export const SET_EDITED_RECORD = "SET_EDITED_RECORD";
export const SET_FORM_STATE = "SET_FORM_STATE";
export const DELETE_RECORD = "DELETE_RECORD";
export const EDIT_RECORD = "EDIT_RECORD";
export const SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS";
export const SET_FORM_SUBMISSION_STATUS = "SET_FORM_SUBMISSION_STATUS";

export enum FetchStatus {
    loading,
    success,
    failure,
    none
}

export enum FormState {
    none,
    closingCreate,
    closingEdit,
    create,
    edit,
}

export interface IValidationError {
    temperature?: string;
    pressure?: string;
    wind?: string;
    humidity?: string;
    temp_desc_id?: string;
    weather_desc_id?: string;
    date?: string;
    city?: string;
    record?: string;
}

export interface IRecord {
    date: string;
    humidity: string;
    pressure: string;
    record_id: string;
    temp_desc_name: string;
    temp_desc_id: string;
    temperature: string;
    weather_desc_name: string;
    weather_desc_id: string;
    wind_speed: string;
}

export interface ITemperatureDescription {
    temp_desc_id: string,
    name: string,
}

export interface IWeatherDescription {
    weather_desc_id: string,
    name: string,
}

export interface IFetchDescriptionsResult {
    temp_descs: ITemperatureDescription[];
    weather_descs: IWeatherDescription[];
}

interface ISetDescriptions {
    type: typeof SET_DESCRIPTIONS;
    payload: IFetchDescriptionsResult;
}

interface ISetSidebarIsClosing {
    type: typeof SET_IS_SIDEBAR_CLOSING;
    payload: boolean;
}

interface ISetFetchStatus {
    type: typeof SET_FETCH_STATUS;
    payload: FetchStatus
}

interface ISetRecords {
    type: typeof SET_RECORDS;
    payload: IRecord[] | null
}

interface ISetEditedRecord {
    type: typeof SET_EDITED_RECORD;
    payload: IRecord | null;
}

interface ISetFormState {
    type: typeof SET_FORM_STATE;
    payload: FormState
}

interface ISetFormErrors {
    type: typeof SET_VALIDATION_ERRORS;
    payload: IValidationError;
}

interface ISetFormSubmissionStatus {
    type: typeof SET_FORM_SUBMISSION_STATUS;
    payload: boolean | null;
}

export interface ICreateFormData {
    temperature: string;
    pressure: string;
    wind: string;
    humidity: string;
    temp_desc_id: string;
    weather_desc_id: string;
    date: string;
    city: string;
}

export interface IDeleteRecord {
    type: typeof DELETE_RECORD;
    payload: IRecord["record_id"]
}

export interface IEditRecord {
    type: typeof EDIT_RECORD;
    payload: FormData;
}

export type SidebarActionTypes = ISetSidebarIsClosing | ISetDescriptions | ISetFetchStatus |
    ISetRecords | ISetEditedRecord | ISetFormState | ISetFormErrors | ISetFormSubmissionStatus;

export interface ISidebarState {
    records: IRecord[] | null;
    editedRecord: IRecord | null;
    isSidebarClosing: boolean;
    validationErrors: IValidationError;
    fetchStatus: FetchStatus;
    formSubmissionStatus: boolean | null;
    descriptions: IFetchDescriptionsResult | null;
    formState: FormState;
}