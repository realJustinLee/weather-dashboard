import {Component} from "react";
import moment from "moment";
import LunarCalendar from "../Tools/LunarCalendar";
import AqiGage from "./AqiGage";

class AqiCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time_text: "Time",
            date_text: "Year/Month/Day",
            lunar_date: "Month/Day",
        }
        this.updateTime = this.updateTime.bind(this);
    }

    componentDidMount() {
        moment.locale('zh-CN');
        this.updateTime();
        setInterval(this.updateTime, 1000);
    }

    updateTime() {
        let lunar_cal = LunarCalendar.solarToLunar();
        let lunar_date_txt = lunar_cal.mmChn + lunar_cal.ddChn;
        // 判断是否节气
        if (lunar_cal.isTerm) {
            lunar_date_txt = lunar_date_txt + lunar_cal.solarTerm;
        }
        this.setState({
            time_text: moment().format('HH:mm:ss'),
            date_text: moment().format('LL dddd'),
            lunar_date: lunar_date_txt,
        })
    }

    render() {
        return (
            <div className="col-sm-10 text-start">
                <div className="h2 my-3" id="city">{this.props.city} · {this.props.district}</div>
                <div className="row my-4">
                    <div className="col-sm-8">
                        <div id="time">{this.state.time_text}</div>
                        <h2 id="date">{this.state.date_text}</h2>
                        <h2 id="lunar-date">农历 {this.state.lunar_date}</h2>
                    </div>
                    <div className="col-sm-4 row align-content-end">
                        <AqiGage
                            aqi={this.props.aqi}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AqiCalendar;