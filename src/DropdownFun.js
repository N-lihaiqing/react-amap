import {Component} from "react";
import React from "react";
import 'antd/dist/antd.css'
import $ from "jquery";

class DropdownFun extends Component{

    constructor(props) {
        super(props);
    }

    mapOnClickBox = () => {
        var $ = require("jquery");
        debugger;
        let val = $('#boxoptem').prop("className");
        if(val == "active"){
            $(".detail-box").css("display", "none");
            $(".boxopt").removeClass("mark-active");
            $(".boxopt em").removeClass("active");
        } else {
            $(".detail-box").css("display", "block");
            $(".boxopt").addClass("mark-active");
            $(".boxopt em").addClass("active");
        }

    };


    render() {
        return (
            <div className={"right-container"}>
                <div id="app-right-top">
                    <div id="tool-container" className="toolscontainer">
                        <div className="ui3-control-wrap clearfixs" id="ui3_control_wrap">
                            <div className="citychangeopt ui3-city-change-wrap" id="ui3_city_change">
                                <span className="adjustpadding"></span>
                                <span className="weather-item" id="weather" title="阴转晴">
                                    <img alt="天气图标" src="https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/aladdin/img/new_weath/simpleico/3.png"/>        </span>
                                <a href="#" map-on-click="selectCity" className="ui3-city-change-inner ui3-control-shadow">
                                    <span>西安市</span><em></em> </a>
                            </div>
                            <div className="left float-l"><b className="tool-gap"></b>
                                <div className="trafficopt" map-on-click="traffic">
                                    <span id="traffic_control" className="last traffic"></span><i>业务功能</i>
                                </div>
                                <b></b>
                                <div className="boxopt" onClick={this.mapOnClickBox}>
                                    <span id="util_control" className="boxutils boxicon"></span>
                                    <i className="boxtext">工具箱</i><em id={"boxoptem"}></em></div>
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
            </div>
    )}

}

export default DropdownFun;