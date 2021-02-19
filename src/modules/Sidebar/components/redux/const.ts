export const SET_IS_SIDEBAR_CLOSING = "SET_IS_SIDEBAR_CLOSING";
export const SET_DESCRIPTIONS = "SET_DESCRIPTIONS";
export const SET_FETCH_STATUS = "SET_FETCH_STATUS";
export const SET_RECORDS = "SET_RECORDS";
export const SET_EDITED_RECORD = "SET_EDITED_RECORD";
export const SET_FORM_STATE = "SET_FORM_STATE";
export const SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS";
export const SET_FORM_SUBMISSION_STATUS = "SET_FORM_SUBMISSION_STATUS";
export const SET_DELETE_RECORD_STATUS = "SET_DELETE_RECORD_STATUS";
export const SET_RECORD_ID_TO_BE_DELETED = "SET_RECORD_ID_TO_BE_DELETED";

export enum FetchStatus {
    loading,
    success,
    failure,
    none
}

export enum DeleteRecordStatus {
    loading,
    failure,
    success,
    none
}

export enum FormSubmissionStatus {
    none,
    success,
    failure
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
    payload: FormSubmissionStatus;
}

interface ISetDeleteRecordStatus {
    type: typeof SET_DELETE_RECORD_STATUS;
    payload: DeleteRecordStatus;
}

interface ISetRecordToBeDeleted {
    type: typeof SET_RECORD_ID_TO_BE_DELETED;
    payload: IRecord["record_id"] | null;
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

export interface IEditFormData extends ICreateFormData {
    record_id: string;
}

export type SidebarActionTypes = ISetSidebarIsClosing | ISetDescriptions | ISetFetchStatus |
    ISetRecords | ISetEditedRecord | ISetFormState | ISetFormErrors | ISetFormSubmissionStatus |
    ISetDeleteRecordStatus | ISetRecordToBeDeleted;

export interface ISidebarState {
    records: IRecord[] | null;
    editedRecord: IRecord | null;
    isSidebarClosing: boolean;
    validationErrors: IValidationError;
    fetchStatus: FetchStatus;
    deleteRecordStatus: DeleteRecordStatus;
    recordIdToBeDeleted: IRecord["record_id"] | null;
    formSubmissionStatus: FormSubmissionStatus;
    descriptions: IFetchDescriptionsResult | null;
    formState: FormState;
}