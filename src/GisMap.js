import {Component} from "react";
import {
    startNavigate,
    initGovernmentArea,
    initPlugin,
    rangingTool,
    showInfoOver,
    mapClickOver,
    showInfoOut
} from "./component";
import React from "react";
import "./ToolBox/DropdownFun.css";

let map = null, marker = null;

class GisMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            secType: 'block',
            thrType: 'none'
        };
    }

    componentDidMount() {
        if (!window.AMap ) {
            return
        }
        this.initMap();

    }


    initMap = () => {
        let map = new window.AMap.Map("allmap", {
            resizeEnable: true,
            rotateEnable: true,
            pitchEnable: true,
            zoom: 11,
            zooms: [3, 20],
            viewMode: '3D',//开启3D视图,默认为关闭
            expandZoomRange: true,
            buildingAnimation: true,//楼块出现是否带动画
            features: ['bg', 'road', 'building'],
            showBuildingBlock: true,
            center: [114.095806,22.677046],
        });

        map.setFitView();
        window.map = map;
    };



    render() {
        const mapBody = {
            width: '100%',
            height: document.body.clientHeight,
            display: 'block',
            position: 'absolute'
        };
        return (
            <div className="AMap-data">
                <div>
                    <div id='allmap' style={{...mapBody}}/>
                </div>
            </div>
        );
    }
}

export default GisMap;