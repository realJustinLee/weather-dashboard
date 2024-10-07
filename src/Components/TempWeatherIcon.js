import React from "react";

export default function TempWeatherIcon({weatherIcon, temperature}) {
    return (
        <div className="col-sm-2 row">
            <div className="d-inline-flex align-self-center">
                <div className={weatherIcon} id="weather_icon"></div>
            </div>
            <div className="h1 align-self-end mb-5" id="temperature-now">
                {temperature}
                <sup>
                    <small>°C</small>
                </sup>
            </div>
        </div>
    );
};