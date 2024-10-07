import React, {useEffect, useState} from "react";
import AqiCalendar from "./Components/AqiCalendar";
import TempWeatherIcon from "./Components/TempWeatherIcon";
import ForecastWidget from "./Components/ForecastWidget";
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/weather.css'
import './css/App.css'

export default function App() {
    const api = process.env.REACT_APP_Q_API
    const key = process.env.REACT_APP_Q_KEY;
    const location = process.env.REACT_APP_LOCATION;
    const locationId = process.env.REACT_APP_LOCATION_ID;

    const [weatherIcon, setWeatherIcon] = useState("sunny");
    const [forecastList, setForecastList] = useState([]);
    const [temperature, setTemperature] = useState(0);
    const [aqi, setAqi] = useState(0);

    useEffect(() => {
        updateWeatherNow();
        updateAqiNow();
        updateForecast();
        setInterval(updateWeatherNow, 1000 * 60 * 3);
        setInterval(updateAqiNow, 1000 * 60 * 5);
        setInterval(updateForecast, 1000 * 60 * 10);
    })

    function updateWeatherNow() {
        const url = api + "/weather/now?location=" + locationId + "&key=" + key;
        $.get(url, (result) => {
            let code = result.now.icon;
            let currentDate = new Date();
            let currentHour = currentDate.getHours();
            let daylight = !(currentHour > 17 || currentHour < 6);
            let animation = "sunny";
            if (code === '100') {
                if (daylight) {
                    animation = "sunny";
                } else {
                    animation = "starry";
                }
            } else if (code >= 101 && code <= 104) {
                animation = "cloudy"
            } else if (code >= 300 && code <= 313) {
                if (code >= 310 && code <= 312) {
                    animation = "stormy"
                } else {
                    animation = "rainy"
                }
            } else if (code >= 400 && code <= 407) {
                animation = "snowy"
            }
            setWeatherIcon(animation);
            setTemperature(result.now.temp);
        })
    }

    function updateForecast() {
        const url = api + "/weather/3d?location=" + locationId + "&key=" + key;
        $.get(url, (result) => {
            let forecast = result.daily;
            let weatherStr, iconDayStr, iconNightStr = null;
            let newForecastList = [];
            for (let i = 0; i < 3; ++i) {
                if (forecast[i].textDay !== forecast[i].textNight) {
                    weatherStr = forecast[i].textDay + "转" + forecast[i].textNight;
                    iconDayStr = forecast[i].iconDay.toString();
                    let iconNight = forecast[i].iconNight;
                    if (iconNight === 100 || iconNight === 103) {
                        iconNight = iconNight + "_night";
                    }
                    iconNightStr = iconNight.toString();
                } else {
                    weatherStr = forecast[i].textDay;
                    iconDayStr = forecast[i].iconDay.toString();
                }

                newForecastList[i] = {
                    weather: (weatherStr).toString(),
                    temp: (forecast[i].tempMin + "°C / " + forecast[i].tempMax + "°C").toString(),
                    windDay: (forecast[i].windDirDay + forecast[i].windScaleDay + "级").toString(),
                    windNight: (forecast[i].windDirNight + forecast[i].windScaleNight + "级").toString(),
                    iconDay: iconDayStr,
                    iconNight: iconNightStr,
                };
            }
            setForecastList(newForecastList);
        })
    }

    function updateAqiNow() {
        const url = api + "/air/now?location=" + locationId + "&key=" + key;
        $.get(url, (result) => {
            setAqi(result.now.aqi);
        })
    }

    return (
        <div className="App">
            <div className="container mt-5">
                <div className="row ms-3">
                    <AqiCalendar
                        location={location}
                        aqi={aqi}
                    />
                    <TempWeatherIcon
                        weatherIcon={weatherIcon}
                        temperature={temperature}
                    />
                </div>
                <hr className="my-4"/>
                <div className="bottom">
                    <div className="row">
                        <ForecastWidget
                            day={"今天"}
                            forecast={forecastList[0]}
                        />
                        <ForecastWidget
                            day={"明天"}
                            forecast={forecastList[1]}
                        />
                        <ForecastWidget
                            day={"后天"}
                            forecast={forecastList[2]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}