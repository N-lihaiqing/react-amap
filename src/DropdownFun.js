import {Component} from "react";
import React from "react";
import 'antd/dist/antd.css'

class DropdownFun extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="app-right-top">
                <div id="tool-container" className="toolscontainer">
                    <div className="ui3-control-wrap clearfixs"
                         id="ui3_control_wrap">
                        <div className="citychangeopt ui3-city-change-wrap" id="ui3_city_change">
                            <span className="adjustpadding"></span>
                            <span className="weather-item" id="weather" title="阴转晴">
                                <img alt="天气图标" src="https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/aladdin/img/new_weath/simpleico/3.png"/>        </span>
                            <a href="#" map-on-click="selectCity" onClick="return false"
                               className="ui3-city-change-inner ui3-control-shadow"> <span>西安市</span><em></em> </a>
                        </div>
                        <div className="left float-l"><b className="tool-gap"></b>
                            <div className="trafficopt" map-on-click="traffic">
                                <span id="traffic_control" className="last traffic"></span><i>路况</i>
                            </div>
                            <b></b>
                            <div className="boxopt" map-on-click="box">
                                <span id="util_control" className="boxutils boxicon"></span>
                                <i className="boxtext">工具箱</i><em></em></div>
                            <div className="detail-box">
                                <ul id="boxul" className="boxinfo">
                                    <li className="map-measure" map-on-click="measure">
                                        <span className="last measure"/><i>测距</i></li>
                                    <li className="map-mark" map-on-click="mark">
                                        <span className="last mark"/><i>标记</i></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )}

}

export default DropdownFun;