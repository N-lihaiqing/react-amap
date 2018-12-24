import {Component} from "react";
import React from "react";
import 'antd/dist/antd.css'
import {location,drawBounds, rulerOffOrOn} from "../component";
require("./MapStyle.css");

class DropdownFun extends Component{

    constructor(props) {
        super(props);
        this.state = {
            mapPopup: 'none',
            businessPopup: 'none',
            hover: false,
            city: '',
        }
    }

    componentDidMount(){
        location((result)=>{
            let val = null;
            if("深圳市" == result.addressComponent.city){
                val = result.addressComponent.district;
            } else {
                val = result.addressComponent.city;
            }
            this.setState({city:val});
            drawBounds(val);
        });
    }

    mapOnClickBox = () => {
        this.removeClass('box');
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

    businessClick = () => {
        this.removeClass('busin');
        var $ = require("jquery");
        let val = $("#businessPopup").prop("className");
        if(val == "active"){
            $(".trafficopt em").removeClass("active");
            this.setState({businessPopup: 'none'});
        } else {
            $(".trafficopt em").addClass("active");
            this.setState({businessPopup: 'block'});
        }

    };

    mapOnClickCity = () => {
        this.removeClass('city');
        var $ = require("jquery");
        let val = $("#ui3_city_change").prop("className");
        let length = val.split(" ").length;
        if(length === 2){
            $(".citychangeopt").addClass("ui3-city-change-click");
            this.setState({mapPopup: 'block'});
        } else {
            $(".citychangeopt").removeClass("ui3-city-change-click");
            this.setState({mapPopup: 'none'});
        }
    };

    removeClass = (obj) => {
        var $ = require("jquery");

        rulerOffOrOn("off"); //关闭测距
        $("#userTagPanl").css("display", "none"); //关闭标记

        if(obj != 'box'){
            if($('#boxoptem').prop("className") == "active"){
                $(".detail-box").css("display", "none");
                $(".boxopt").removeClass("mark-active");
                $(".boxopt em").removeClass("active");
                $(".boxtext").removeClass("active");
                $(".boxicon").removeClass("active");
            }
        }

        if(obj != 'busin'){
            if($("#businessPopup").prop("className") == "active"){
                $(".trafficopt em").removeClass("active");
                this.setState({businessPopup: 'none'});
            }
        }

        if(obj != 'city'){
            let val = $("#ui3_city_change").prop("className");
            let length = val.split(" ").length;
            if(length === 3){
                $(".citychangeopt").removeClass("ui3-city-change-click");
                this.setState({mapPopup: 'none'});
            }
        }
    };

    clickCityName = (e) => {
        var $ = require("jquery");
        $("#selCityHotCityId span").removeClass("active");
        $(e.target).addClass("active");
        let html = e.target.innerHTML;
        this.setState({city: html});
        $(".right-container .map_popup #CurCityInfo").html("当前城市："+html);
        drawBounds(html);
    };

    menuClick = (val) => {
        var $ = require("jquery");
        $(".detail-box").css("display", "none");
        $(".boxopt").removeClass("mark-active");
        $(".boxopt em").removeClass("active");
        $(".boxtext").removeClass("active");
        $(".boxicon").removeClass("active");
        if("measure" == val){
            rulerOffOrOn("on");  //开启测距
            $("#userTagPanl").css("display", "none");
        } else {
            rulerOffOrOn("off");
            $("#userTagPanl").css("display", "block");
        }
    };

    closeBtn = () => {
        var $ = require("jquery");
        $("#userTagPanl").css("display", "none"); //关闭标记
    };

    clickSignPanel = (e, val) => {
        debugger;
        var $ = require("jquery");
        $("#userSignPanel b").removeClass("hover").removeClass("mark-sign");
        $(e.target).addClass("hover").addClass("mark-sign");
    };

    signPanel = (e, val) => {
        var $ = require("jquery");
        let className = $(e.target).prop("className").split(" ");
        if(className.length != 3){
            if(val === "over"){
                $(e.target).addClass("hover");
            } else {
                $(e.target).removeClass("hover");
            }
        }
    };


    render() {

        let mapPopup = {
            width: '281px',
            display: this.state.mapPopup,
            height: '190px',
            right: '39px',
            top: '57px',
            position: 'absolute',
            background: '#FFF',
        };
        let businessPopup = {
            width: '281px',
            display: this.state.businessPopup,
            height: '190px',
            right: '39px',
            top: '57px',
            position: 'absolute',
            background: '#FFF',
        };

        let citySpan = {
            marginRight:'10px',
        };


        return (
            <div className={"right-container"}>
                <div id="app-right-top">
                    <div id="tool-container" className="toolscontainer">
                        <div className="ui3-control-wrap clearfixs" id="ui3_control_wrap">
                            <div className="citychangeopt ui3-city-change-wrap" id="ui3_city_change"  onClick={this.mapOnClickCity}>
                                <span className="adjustpadding"></span>
                                <span className="weather-item" id="weather" title="阴转晴">
                                    <img alt="天气图标" src="https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/aladdin/img/new_weath/simpleico/3.png"/></span>
                                <a href="#" map-on-click="selectCity" className="ui3-city-change-inner ui3-control-shadow">
                                    <span>{this.state.city}</span><em></em> </a>
                            </div>
                            <div className="left float-l"><b className="tool-gap"></b>
                                <div className="trafficopt" map-on-click="traffic" onClick={this.businessClick}>
                                    <span id="traffic_control" className="last traffic"></span><i>业务功能</i>
                                    <em id={"businessPopup"}></em>
                                </div>
                                <b></b>
                                <div className="boxopt" onClick={this.mapOnClickBox}>
                                    <span id="util_control" className="boxutils boxicon"></span>
                                    <i className="boxtext">工具箱</i><em id={"boxoptem"}></em></div>
                                <div className="detail-box">
                                    <ul id="boxul" className="boxinfo">
                                        <li className="map-measure" onClick={() => {this.menuClick("measure")}}>
                                            <span className="last measure"/><i>测距</i></li>
                                        <li className="map-mark" onClick={() => {this.menuClick("mark")}}>
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
                        <div className="content" style={{height: '200px', overflow: 'hidden'}}>
                            <div className="sel_city blueC">
                                <div id="selCityTop" style={{width:'100%', fontSize: '12px'}}>
                                    <div className="sel_city_default" id="set_default_city" style={{display: 'block'}}>
                                        <p id="CurCityInfo">当前城市：西安市</p>
                                    </div>
                                    <div id="selCityHotCityId" className="sel-city-hotcity">
                                        <span onClick={this.clickCityName} style={citySpan}>罗湖区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>福田区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>南山区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>盐田区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>关外区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>龙岗区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>宝安区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>光明新区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>坪山新区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>大鹏新区</span>
                                        <span onClick={this.clickCityName} style={citySpan}>龙华新区</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="business_popup " style={businessPopup}>
                    <div className="popup_business">
                        <div className="title">业务范围</div>
                        <div className="content" style={{height: '200px', overflow: 'hidden'}}>
                            <div className="sel_business blueC">
                                <div id="selBusinessTop" style={{width:'100%', fontSize: '12px'}}>
                                    <div id="selBusinessId" className="sel-business">
                                        <span style={citySpan}>病害</span>
                                        <span style={citySpan}>三危设施</span>
                                        <span style={citySpan}>施工占道</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="userTagPanl BMap_noprint anchorTR" id="userTagPanl"
                     style={{position: "absolute", zIndex: "20000", bottom: "auto", right: "106px", top: "59px", left: "auto"}}>
                    <div className="cont" id="userSignPanel">
                        <div className="bg">
                            <div><b title="标记地点" usertagpanl="1" className="userTagPanlP hover"
                                    onClick={() => {this.clickSignPanel("place")}}
                                    onMouseOver={(e) => {this.signPanel(e, "over")}}
                                    onMouseOut={(e) => {this.signPanel(e, "out")}}></b>
                                <b title="手绘路线"  usertagpanl="2"
                                   className="userTagPanlL"
                                   onClick={() => {this.clickSignPanel("route")}}
                                   onMouseOver={(e) => {this.signPanel(e, "over")}}
                                   onMouseOut={(e) => {this.signPanel(e, "out")}}></b>
                                <b  title="文字备注" usertagpanl="3" className="userTagPanlF"
                                onClick={() => {this.clickSignPanel("word")}}
                                onMouseOver={(e) => {this.signPanel(e, "over")}}
                                onMouseOut={(e) => {this.signPanel(e, "out")}}></b>
                                <b title="关闭" onClick={this.closeBtn}  className="closeBtn"></b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )}

}

export default DropdownFun;