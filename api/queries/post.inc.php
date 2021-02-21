<?php

const POST_ADD_DATA = "INSERT INTO records (date,temperature,pressure,humidity,wind_speed,temp_desc_id,weather_desc_id,city_id) 
VALUES(:date,:temperature,:pressure,:humidity,:wind,:temp_desc_id,:weather_desc_id,:city)";

const POST_EDIT_DATA = "UPDATE records SET date=:date,temperature=:temperature,pressure=:pressure,
humidity=:humidity,wind_speed=:wind,temp_desc_id=:temp_desc_id,weather_desc_id=:weather_desc_id WHERE record_id=:record_id";
