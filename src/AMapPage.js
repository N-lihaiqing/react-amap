import React, {Component} from 'react';
import {loadMap} from "./lib/api";
import Map from "./lib/Map";
import style from "./lib/amapStype.css";
import Marker from './lib/Marker';  //组件用于在地图上显示标记点
import MassMarks from "./lib/MassMarks"; //组件用于在地图上显示标记点
import Polygon from './lib/Polygon';  //Polyline 和 Polygon 组件分别用于在地图上绘制折线和多边形；
import Polyline from './lib/Polyline';
import Circle from "./lib/Circle";  //用于在地图上绘制一个圆形
import InfoWindow from './lib/InfoWindow';
import PropTypes from "prop-types"; //用于在地图上显示信息窗体


class AMapPage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let that = this;
        let map = loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
            let roadNet = new AMap.TileLayer.RoadNet();
            let traffic = new AMap.TileLayer.Traffic({
                autoRefresh: true, //是否自动刷新，默认为false
                interval: 15 //刷新间隔，默认180s
            });

            that.setState({
                AMap,
                layers: [roadNet, traffic],
                center: [114.066852, 22.562341],  //初始化地图中心点
                radius: 0,  //半径
                resizeEnable: true, //是否监控地图容器尺寸变化
                dragEnable: true, // 地图是否可通过鼠标拖拽平移
                keyboardEnable: false, //地图是否可通过键盘控制
                doubleClickZoom: true, // 地图是否可通过双击鼠标放大地图
                zoomEnable: true, //地图是否可缩放
                rotateEnable: false, // 地图是否可旋转
                zoom: 11, //初始化地图层级
            });

            this.initMap();
        });
    }



    initMap = () => {
        let lnglats = [
            [114.127277,22.53317],
            [113.988574,22.567414],
            [114.081958,22.639678],
            [113.992694,22.501455]
        ];

        this.addMarker(); // 实例化点标记
    };


    // 实例化点标记
    addMarker = () => {
        let marker = new window.AMap.Marker({
            icon: "https//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            position: [113.988574,22.567414],
            offset: new window.AMap.Pixel(-13, -30)
        });
        window.AMap.Map.add(marker);

    };

    markerClick =(e) => {
        let infoWindow = new window.AMap.InfoWindow({offset: new window.AMap.Pixel(0, -30)});
        infoWindow.setContent(e.target.content);
        infoWindow.open(window.AMap.Map, e.target.getPosition());
    }

    /** 鼠标双击事件 */
    mapDblclick = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("鼠标双击事件 "+ center);
        // this.InfoWindow(e);
    };

    /** 鼠标单击事件 */
    mapClick = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("鼠标单击事件 "+ center);
        // this.InfoWindow(e);
    };

    /** 鼠标移动事件 */
    mousemove = (e) => {
        // InfoWindow(e);

    };

    InfoWindow = (e) => {
        let content = '<div class="info-title">高德地图</div><div class="info-content">' +
            '<img src="https://webapi.amap.com/images/amap.jpg">' +
            '高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。<br/>' +
            '<a target="_blank" href = "https://mobile.amap.com/">点击下载高德地图</a></div>';
debugger;

        new window.AMap.InfoWindow({
            content: content,
            placeSearch: false,
            asDestination: false,
            offset: new window.AMapAMap.Pixel(0, -30)
        });
    };

    render() {
        return (
            <div>
                <div>
                    <Map
                        style={{width: 1600, height: 800}}
                        options={{center: this.state.center, layers: this.state.layers}}
                        events={{
                            click: this.mapClick,
                            dblclick: this.mapDblclick,
                            mousemove: this.mousemove,
                        }}
                    >
                    </Map>
                </div>
                {/*<div>
                    {this.state.element === 'marker' &&
                    <Marker />
                    }
                    {this.state.element === 'massmarks' &&
                    <MassMarks />
                    }
                    {this.state.element === 'polygon' &&
                    <Polygon />
                    }
                    {this.state.element === 'polyline' &&
                    <Polyline/>
                    }
                    {this.state.element === 'circle' &&
                    <Circle />
                    }
                    {this.state.element === 'infowindow' &&
                    <InfoWindow />
                    }
                </div>*/}
            </div>
        );
    }


}

export default AMapPage;