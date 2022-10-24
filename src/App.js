import {Component} from "react";
import AqiCalendar from "./Components/AqiCalendar";
import TempWeatherIcon from "./Components/TempWeatherIcon";
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/weather.css'
import './css/App.css'
import ForecastWidget from "./Components/ForecastWidget";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            he_key: "53de4cf13c644f7b92924b934d7c3610",
            city: "上海",
            district: "浦东新区",
            station: "浦东新区监测站",
            weather_icon: "sunny",
            forecast: [],
            temp: 0,
            aqi: 0,
        }
        this.updateAqi = this.updateAqi.bind(this);
        this.updateWeather = this.updateWeather.bind(this);
    }

    componentDidMount() {
        this.updateAqi();
        this.updateWeather();
        setInterval(this.updateAqi, 1000 * 60 * 10);
        setInterval(this.updateWeather, 1000 * 60 * 10);
    }

    updateAqi() {
        const node = this;
        const url = "https://free-api.heweather.com/s6/air/now?location=" + this.state.city + "&key=" + this.state.he_key;
        $.getJSON(url, function (data) {
            let result = data.HeWeather6[0];
            // AQI
            for (let i = 0; i < result.air_now_station.length; i++) {
                let v = result.air_now_station[i];
                if (v.air_sta === node.state.station) {
                    node.setState({
                        aqi: v.aqi,
                    })
                }
            }
        });
    }

    updateWeather() {
        const node = this;
        const url = "https://free-api.heweather.com/s6/weather?location=" + this.state.city + "&key=" + this.state.he_key;
        $.getJSON(url, function (data) {
            // 天气动画
            let result = data.HeWeather6[0];

            // 天气动画
            let code = result.now.cond_code;
            let myDate = new Date();
            let currentHour = myDate.getHours();
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
            // 当前
            let now = result.now;
            node.setState({
                weather_icon: animation,
                temp: now.tmp,
            })

            let forecast = result.daily_forecast;
            let weatherStr, iconDStr, iconNStr = null;
            let forecast_list = node.state.forecast;
            for (let i = 0; i < 3; ++i) {
                if (forecast[i].cond_txt_d !== forecast[i].cond_txt_n) {
                    weatherStr = forecast[i].cond_txt_d + "转" + forecast[i].cond_txt_n;
                    iconDStr = forecast[i].cond_code_d.toString();
                    let icon_code_night = forecast[i].cond_code_n;
                    if (icon_code_night === 100 || icon_code_night === 103) {
                        icon_code_night = icon_code_night + "_night";
                    }
                    iconNStr = icon_code_night.toString();
                } else {
                    weatherStr = forecast[i].cond_txt_d;
                    iconDStr = forecast[i].cond_code_d.toString();
                }

                forecast_list[i] = {
                    weather: (weatherStr).toString(),
                    temp: (forecast[i].tmp_min + "°C / " + forecast[i].tmp_max + "°C").toString(),
                    //"wind": "东风3-4级", TODO 也可能是“东北风微风”，不应该加“级”
                    wind: (forecast[i].wind_dir + forecast[i].wind_sc + "级").toString(),
                    iconD: iconNStr,
                    iconN: iconDStr,
                };
            }

            node.setState({
                forecast: forecast_list,
            })
        });
    }

    render() {
        return (
            <div className="App">
                <div className="container mt-5">
                    <div className="row ms-3">
                        <AqiCalendar
                            city={this.state.city}
                            district={this.state.district}
                            aqi={this.state.aqi}
                        />
                        <TempWeatherIcon
                            weather_icon={this.state.weather_icon}
                            temp={this.state.temp}
                        />
                    </div>
                    <hr className="my-4"/>
                    <div className="bottom">
                        <div className="row">
                            <ForecastWidget
                                day={"今天"}
                                forecast={this.state.forecast[0]}
                            />
                            <ForecastWidget
                                day={"明天"}
                                forecast={this.state.forecast[1]}
                            />
                            <ForecastWidget
                                day={"后天"}
                                forecast={this.state.forecast[2]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
