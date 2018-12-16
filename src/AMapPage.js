import React, {Component} from 'react';
import axios from "axios";

let map = null, marker = null, AMap = null;

class AMapPage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let that = this;
        axios.get(`https://webapi.amap.com/maps?v=1.4.11&key=0325e3d6d69cd56de4980b4f28906fd8`)
            .then(function () {
                AMap = window.AMap;
                let markerObj, mapObj = new AMap.Map("allmap", {
                    resizeEnable: true,
                    center: [114.127277, 22.53317],
                    zoom: 12
                });

                marker = markerObj;
                map = mapObj;
                map.setFitView();

                that.initMap();
            });
    }

    componentWillMount() {
    }


    initMap = () => {
        let lnglats = [
            [114.127277, 22.53317],
            [113.988574, 22.567414],
            [114.081958, 22.539678],
            [113.992694, 22.501455]
        ];

        this.addMarker(lnglats); // 实例化点标记
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
                // offset: new window.AMap.Pixel(-13, -30)
            });
            marker.setMap(map);
            marker.on('click', this.mapClickOver);
            marker.on('mouseover', this.showInfoOver);
            marker.on('mouseout', this.showInfoOut);
        }
    };

    /** 鼠标双击事件 */
    mapDblclick = (e) => {
        // let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        // console.log("鼠标双击事件 " + center);
    };

    /** 鼠标单击覆盖物事件 */
    mapClickOver = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("鼠标单击事件 "+center);
        this.infoWindow(e);
    };

    /** 解绑覆盖物事件 */
    mapClickOut = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("解绑覆盖物事件 "+center);
      debugger;
    };

    /** 鼠标移入事件 绑定事件 */
    showInfoOver = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("鼠标移入事件 "+center);
        debugger;
    };

    /** 鼠标移出  解绑事件 */
    showInfoOut = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("鼠标移出 "+center);
        debugger;
    };


    infoWindow = (e) => {
        let data = e.target.C.data;
        let type = e.target.C.gpsType;
        let infoHtml = null;
        if (type === "bringInfo") {
            infoHtml += "桥梁信息"
        } else if (type === "dires") {
            infoHtml += "病害信息"
        } else if (type === "track") {
            infoHtml += "巡查信息"
        } else if (type === "danger") {
            infoHtml += "三危信息"
        }
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];

        //创建信息窗体
        var infoWindow = new window.AMap.InfoWindow({
            content: infoHtml //信息窗体的内容
        });

        // AMap.event.addListener(marker, 'click', function () { //监听点标记的点击事件
        infoWindow.open(map, center); //信息窗体打开
        // });

    };

    render() {
        return (
            <div>
                <div>
                    <div id='allmap' style={{width: '1300px', height: '600px'}}/>
                </div>
            </div>
        );
    }


}

export default AMapPage;