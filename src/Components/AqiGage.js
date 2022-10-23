import {Component} from "react";
import JustGage from 'justgage'

class AqiGage extends Component {

    componentDidMount() {
        this.theGage = new JustGage({
            id: "aqi-indicator",
            value: 0,
            min: 0,
            max: 300,
            title: "空气指数",
            label: "AQI",
            pointer: true,
            pointerOptions: {
                toplength: 0,
                bottomlength: 20,
                bottomwidth: 5,
                color: '#ffffff',
                stroke: '#5a5a5a',
                stroke_width: 2,
                stroke_linecap: 'round'
            },
            gaugeWidthScale: 0.4,
            hideMinMax: false,
            valueFontColor: "white",
            valueMinFontSize: 40,
            customSectors: [{
                color: "#00ff00",
                lo: 0,
                hi: 50
            }, {
                color: "#ffcc00",
                lo: 50,
                hi: 100
            }, {
                color: "#ff8a00",
                lo: 100,
                hi: 150
            }, {
                color: "#f70000",
                lo: 150,
                hi: 200
            }, {
                color: "#90024c",
                lo: 200,
                hi: 300
            }],
            counter: true
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        this.theGage.refresh(nextProps.aqi);
        return true;
    }

    render() {
        return (
            <div id="aqi-indicator"></div>
        );
    }
}

export default AqiGage;