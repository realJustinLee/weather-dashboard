import React from "react";

export default function ForecastWidget({day, forecast}) {
    if (forecast == null) {
        return null;
    }
    return (
        <div className="col-sm-4">
            <h2 id="day">{day}</h2>
            <div className="icon-wrapper" id="icon">
                <img src={"./img/" + forecast.iconDay + ".png"} height="135" width="135" alt=""/>
                {forecast.iconNight !== null ? (
                    <img src={"./img/" + forecast.iconNight + ".png"} height="135" width="135" alt=""/>
                ) : (<img alt=""/>)}
            </div>
            <h3 className="weather">{forecast.weather}</h3>
            <h3 className="temp">{forecast.temp}</h3>
            <h3 className="wind">白天：{forecast.windDay}</h3>
            <h3 className="wind">晚上：{forecast.windNight}</h3>
        </div>
    );
};