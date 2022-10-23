import {Component} from "react";

class ForecastWidget extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    render() {
        if (this.props.forecast == null) {
            return null;
        }
        return (
            <div className="col-sm-4">
                <h2 id="day">{this.props.day}</h2>
                <div className="icon-wrapper" id="icon">
                    <img src={"./img/" + this.props.forecast.iconD + ".png"} height="135" width="135" alt=""/>
                    <img src={"./img/" + this.props.forecast.iconN + ".png"} height="135" width="135" alt=""/>
                    {this.props.forecast.iconN === "" ? (
                        <img src={"./img/" + this.props.forecast.iconN + ".png"} height="135" width="135" alt=""/>
                    ) : (<img alt=""/>)}
                </div>
                <h3 className="weather">{this.props.forecast.weather}</h3>
                <h3 className="temp">{this.props.forecast.temp}</h3>
                <h3 className="wind">{this.props.forecast.wind}</h3>
            </div>
        );
    }
}

export default ForecastWidget;