<?php

const GET_CITY_CONTENT = "SELECT records.*, temperature_descriptions.name as temp_desc_name, weather_descriptions.name as weather_desc_name
FROM records LEFT JOIN temperature_descriptions USING(temp_desc_id) 
LEFT JOIN weather_descriptions USING(weather_desc_id) 
LEFT JOIN cities USING(city_id) WHERE iso=:iso ORDER BY date DESC";


const GET_WEATHER_DESCRIPTIONS = "SELECT * FROM weather_descriptions";
const GET_TEMPERATURE_DESCRIPTIONS = "SELECT * FROM temperature_descriptions";
const GET_WEATHER_DESCRIPTION = "SELECT * FROM weather_descriptions WHERE weather_desc_id=:weather_desc_id";
const GET_TEMPERATURE_DESCRIPTION = "SELECT * FROM temperature_descriptions WHERE  temp_desc_id=:temp_desc_id";
const GET_CITY = "SELECT * FROM cities WHERE iso=:city";
const GET_RECORD = "SELECT * FROM records WHERE record_id=:record_id";
