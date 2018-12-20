import {Component} from "react";
import React from "react";
import 'antd/dist/antd.css'
import $ from "jquery";

class DropdownFun extends Component{

    constructor(props) {
        super(props);
        this.state = {
            mapPopup: true,
        }
    }

    mapOnClickBox = () => {
        var $ = require("jquery");
        let val = $('#boxoptem').prop("className");
        if(val == "active"){
            $(".detail-box").css("display", "none");
            $(".boxopt").removeClass("mark-active");
            $(".boxopt em").removeClass("active");
            $(".boxtext").removeClass("active");
            $(".boxicon").removeClass("active");
        } else {
            $(".detail-box").css("display", "block");
            $(".boxopt").addClass("mark-active");
            $(".boxopt em").addClass("active");
            $(".boxtext").addClass("active");
            $(".boxicon").addClass("active");
        }
    };


    render() {

        let mapPopup = {
            width: '295px',
            display: this.state.mapPopup,
            height: '393px',
            right: '69px',
            top: '57px',
            position: 'absolute',
            background: '#FFF',
        };

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
                <div className="map_popup " style={mapPopup}>
                    <div className="popup_main">
                        <div className="title">城市列表</div>
                        <div className="content" style={{height: '369px', overflow: 'hidden'}}>
                            <div className="sel_city blueC" onMouseDown="T.G('selCityInfo').style.display = 'none'">
                                <div id="selCityTop" style={{width:'100%'}}>
                                    <div className="sel_city_default" id="set_default_city" style={{display: 'block'}}>
                                        <p id="CurCityInfo"><span>当前城市：西安市</span></p>
                                    </div>
                                    <div className="sel-city-hotcity" style={{display:'none'}}>
                                        <a href="javascript:void(0)" className="search_nation">在全国范围内检索</a>
                                    </div>
                                    <div id="selCityHotCityId" className="sel-city-hotcity">
                                        <a href="javascript:void(0)"  name="全国" style={{marginRight:'5px'}}>福田区</a>
                                        <a href="javascript:void(0)" citycode="131" name="北京"
                                           style={{marginRight:'10px'}}>北京</a>
                                        <a href="javascript:void(0)" citycode="289" name="上海"
                                           style={{marginRight:'10px'}}>上海</a>
                                        <a href="javascript:void(0)" citycode="257" name="广州"
                                           style={{marginRight:'10px'}}>广州</a>
                                        <a href="javascript:void(0)" citycode="340" name="深圳"
                                           style={{marginRight:'10px'}}>深圳</a>
                                        <a href="javascript:void(0)" citycode="75" name="成都"
                                           style={{marginRight:'10px'}}>成都</a>
                                        <a href="javascript:void(0)" citycode="332" name="天津"
                                           style={{marginRight:'10px'}}>天津</a>
                                        <a href="javascript:void(0)" citycode="315" name="南京"
                                           style={{marginRight:'10px'}}>南京</a>
                                        <a href="javascript:void(0)" citycode="179" name="杭州"
                                           style={{marginRight:'10px'}}>杭州</a>
                                        <a href="javascript:void(0)" citycode="218" name="武汉"
                                           style={{marginRight:'10px'}}>武汉</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            </div>
    )}

}

export default DropdownFun;