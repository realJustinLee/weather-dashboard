import React, {useEffect, useState} from "react";
import moment from "moment";
import LunarCalendar from "../Tools/LunarCalendar";
import AqiGage from "./AqiGage";

export default function AqiCalendar({location, aqi}) {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [lunarDate, setLunarDate] = useState("");

    useEffect(() => {
        moment.locale('zh-CN');
        updateTime();
        setInterval(updateTime, 1000);
    })

    function updateTime() {
        let lunar_cal = LunarCalendar.solarToLunar();
        let lunar_date_txt = lunar_cal.mmChn + lunar_cal.ddChn;
        // 判断是否节气
        if (lunar_cal.isTerm) {
            lunar_date_txt = lunar_date_txt + lunar_cal.solarTerm;
        }
        setTime(moment().format('HH:mm:ss'));
        setDate(moment().format('LL dddd'));
        setLunarDate(lunar_date_txt);
    }

    return (
        <div className="col-sm-10 text-start">
            <div className="h2 my-3" id="city">{location}</div>
            <div className="row my-4">
                <div className="col-sm-8">
                    <div id="time">{time}</div>
                    <h2 id="date">{date}</h2>
                    <h2 id="lunar-date">农历 {lunarDate}</h2>
                </div>
                <div className="col-sm-4 row align-content-end">
                    <AqiGage
                        gageId="aqi-gage"
                        aqi={aqi}
                    />
                </div>
            </div>
        </div>
    );
}