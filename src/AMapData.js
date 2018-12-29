import {Component} from "react";
import {startNavigate, initGovernmentArea, initPlugin, rangingTool,showInfoOver,mapClickOver,showInfoOut} from "./component";
import React from "react";
import "./ToolBox/DropdownFun.css";

let map = null,marker = null ;

class AMapData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            secType:'block',
            thrType:'none'
        };
        this.aMap='';
    }

    componentDidMount() {
        if(!window.AMap){
            return
        }
        this.initMap();
        initPlugin();
        this.init3DMap();
    }

    changeMapType =() =>{

        let {secType,thrType} = this.state;
        secType=secType === 'block'?'none':'block';
        thrType=thrType === 'block'?'none':'block';
        window.map=window.map === this.aMap?map:this.aMap;
        if(Object.keys(window.endLocation).length>0){
            startNavigate(window.navigateWay,window.startLocation,window.endLocation);
        }
        this.setState({

            secType:secType,
            thrType:thrType
        });
    };

    initMap = () => {
        let markerObj, mapObj = new window.AMap.Map("allmap", {
            doubleClickZoom: true,  //双击放大
            center: [114.127277, 22.53317],
            zoom: 10,
            layers:[new window.AMap.TileLayer.RoadNet],
            features:['bg','road'],
        });

        marker = markerObj;
        map = mapObj;
        map.setFitView();
        window.map = map;

        initGovernmentArea(); //初始化行政区域

        rangingTool();  //初始化测距控件

        // initToolBar(); //初始化工具条控件

        // let lnglats = [
        //     [114.06391, 22.548443],
        //     [114.064134, 22.548172],
        //     [114.064507, 22.548168],
        //     [114.064826, 22.548089]
        // ];
        // this.addMarker(lnglats); // 实例化点标记
        // this.polyline();
        // this.circle(); //初始化矢量图层
    };


    init3DMap = () =>{
        let aMap = new window.AMap.Map("3D-AMap", {
            resizeEnable: true,
            rotateEnable:true,
            pitchEnable:true,
            doubleClickZoom: true,  //双击放大
            center: [114.127277, 22.53317],
            zoom: 15,
            zooms:[3,20],
            pitch:50,
            rotation:10,
            viewMode:'3D',//开启3D视图,默认为关闭
            expandZoomRange:true,
            buildingAnimation:true,//楼块出现是否带动画
            features:['bg','road'],  //区域面（bg）道路（road）建筑物（building）标注（point）
        });

        aMap.plugin([
            'AMap.ControlBar',
        ], function(){
            aMap.addControl(new window.AMap.ControlBar({
                showZoomBar:false,
                showControlButton:true,
                position:{
                    right:'10px',
                    bottom:'150px'
                }
            }));
        });

        this.aMap = aMap;

    };

    /** 添加点标记 */
    addMarker = (lnglats) => {
        for (let i = 0; i < lnglats.length; i++) {
            let url = "https://webapi.amap.com/theme/v1.3/markers/n/mark_b" + (i + 1) + ".png";
            let gpsType = null;
            if (i === 0) {
                gpsType = "bringInfo";
            } else if (i === 1) {
                gpsType = "dires";
            } else if (i === 2) {
                gpsType = "track";
            } else if (i === 3) {
                gpsType = "danger"
            }

            marker = new window.AMap.Marker({
                icon: url,
                position: [lnglats[i][0], lnglats[i][1]],
                data: lnglats,
                gpsType: gpsType,
            });

            marker.setMap(map);
            marker.on('click', mapClickOver);
            marker.on('mouseover', showInfoOver);
            marker.on('mouseout', showInfoOut);
        }
    };

    /** 坐标连线 */
    polyline = () => {
        let lineArr = [];
        lineArr.push([114.063766, 22.548147]);
        lineArr.push([114.064601, 22.548147]);
        lineArr.push([114.064907, 22.548168]);
        lineArr.push([114.065046, 22.548289]);
        lineArr.push([114.06594, 22.548539]);
        // 绘制轨迹
        var polyline = new window.AMap.Polyline({
            map: map,
            path: lineArr,
            strokeColor: "red",  //线颜色
            strokeOpacity: 1,     //线透明度
            strokeWeight: 3,      //线宽
            strokeStyle: "solid"  //线样式
        });
        map.setFitView();
    };

    /** 圆形矢量图形 */
    circle = () => {
        let lnglats = [
            [113.891574, 22.581393], //宝安区
            [113.936543, 22.555591], //南山区
            [114.049679, 22.78319], //龙华
            [114.067292, 22.54342],  //福田区
            [114.237683, 22.581593],  //盐田区
            [114.251004, 22.743083]  //龙岗区
        ];

        let circle = null;
        for(let i = 0; i < lnglats.length; i++){
            circle = new window.AMap.Circle({
                center: new window.AMap.LngLat(lnglats[i][0],lnglats[i][1]),// 圆心位置
                radius: 500, //半径
                strokeColor: "#FFF", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 0, //线粗细度
                fillColor: "#58AA55", //填充颜色
                fillOpacity: 0.75,//填充透明度
                gpsType: 'area',
            });
            circle.setMap(map);
            let overlayGroup = new window.AMap.OverlayGroup([circle]);


            let html = "";
            if(i == 1){
                html = "宝安区"
            } else if(i == 2){
                html = "南山区"
            } else if(i == 3){
                html = "龙华区"
            } else if(i == 4){
                html = "福田区"
            } else {
                html = "盐田区"
            }
            // 创建纯文本标记
            let text = new window.AMap.Text({
                text:html,
                textAlign:'center', // 'left' 'right', 'center',
                verticalAlign:'middle', //middle 、bottom
                draggable:true,
                cursor:'pointer',
                angle:10,
                style:{
                    'background-color': 'transparent',
                    'width': 'auto',
                    'border-width': 0,
                    'text-align': 'center',
                    'font-size': '16px',
                    'color': 'white'
                },
                position: lnglats[i]
            });

            text.setMap(map);
            circle.on('mouseover', showInfoOver);
            circle.on('mouseout', showInfoOut);
            circle.on('click', mapClickOver);
        }
        // 缩放地图到合适的视野级别
        // map.setFitView([circle]);
        map.setZoom(14);
    };

    render() {
        const mapBody = {
            width:'100%',
            height:  document.body.clientHeight,
            display:'block'
        };

        const {secType,thrType} = this.state;

        return (
            <div className="AMap-data">
                <div >
                    <div id='allmap' style={{...mapBody,display:secType}}/>
                    <div id="3D-AMap" style={{...mapBody,display:thrType}}/>
                </div>
                <div  onClick={this.changeMapType} className="change-map-type">
                    <div style={{display:secType}} className="change-map-2D-icon"/>
                    <div style={{display:thrType}} className="change-map-3D-icon"/>
                </div>
            </div>
        );
    }
}
export default AMapData;