import React, {Component} from "react";
import "./ToolBar.css"
import {setZoom} from "../component"

class ToolBar extends Component{

    constructor(props) {
        super(props);
    }

    toolBarClick = (e) => {
        let $ = require("jquery");
        let type = $(e.target).prop("className").split(" ")[2];
        setZoom(type);
    };

    componentDidMount(){
        /*定位控件*/
        window.map.plugin('AMap.Geolocation', function() {
            const geolocation = new window.AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 10000,
                //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: true,
                //  定位按钮的排放位置,  RB表示右下
                buttonPosition: 'RB',
                buttonDom: '<div title="定位" class="amap-location-div"><div class="amap-location-icon"/></div>'
            });

            window.map.addControl(geolocation);
            geolocation.getCurrentPosition();
        })
    };

    render() {
        return(
            <div className={"toolBar"}>
                <div id="scalebox" className="zdeps-1 usel">
                    <div className="zoom_map zoom_in_map in" onClick={this.toolBarClick}></div>
                    <div className="zoom_map zoom_out_map out" onClick={this.toolBarClick}></div>
                </div>
            </div>
        );
    }
}

export default ToolBar;