import {Component} from "react";

class TempWeatherIcon extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    render() {
        return (
            <div className="col-sm-2 row">
                <div className="d-flex align-items-center justify-content-center mt-5 pt-5 me-5 pe-5">
                    <div className={this.props.weather_icon} id="weather_icon"></div>
                </div>
                <div className="h1 align-self-end mb-5 pb-5" id="temperature-now">
                    {this.props.temp}
                    <sup>
                        <small>°C</small>
                    </sup>
                </div>
            </div>
        );
    }
}

export default TempWeatherIcon;