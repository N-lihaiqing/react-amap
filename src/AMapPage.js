import React, {Component} from 'react';
import axios from "axios";
import css from "./MapStyle.css";
import {onComplete, onError, createInfoWindow} from "./component";

let map = null, marker = null, geolocation = null;

class AMapPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let that = this;
        axios.get(`https://webapi.amap.com/maps?v=1.4.11&key=0325e3d6d69cd56de4980b4f28906fd8`)
            .then(function () {
                let AMap = window.AMap;
                let markerObj, mapObj = new AMap.Map("allmap", {
                    resizeEnable: true,
                    center: [114.127277, 22.53317],
                    zoom: 12
                });

                marker = markerObj;
                map = mapObj;
                map.setFitView();

                map.plugin('AMap.Geolocation', function() {
                    debugger;
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：5s
                        buttonPosition:'RB',    //定位按钮的停靠位置
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

                    });
                    map.addControl(geolocation);
                    // geolocation.getCurrentPosition(function(status,result){
                    //     if(status=='complete'){
                    //         onComplete(result)
                    //     }else{
                    //         onError(result)
                    //     }
                    // });
                });

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
        this.polyline();
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
            marker.on('click', this.mapClickOver);
            marker.on('mouseover', this.showInfoOver);
            marker.on('mouseout', this.showInfoOut);
        }
    };

    /** 坐标连线 */
    polyline = () => {
        let lineArr = [];
        lineArr.push([114.127277, 22.53317]);
        lineArr.push([113.988574, 22.567414]);
        lineArr.push([114.081958, 22.539678]);
        lineArr.push([113.992694, 22.501455]);
        lineArr.push([114.033933, 22.626589]);
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

    /** 鼠标双击事件 */
    mapDblclick = (e) => {
        // let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        // console.log("鼠标双击事件 " + center);
    };

    /** 鼠标单击覆盖物事件 */
    mapClickOver = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("鼠标单击事件 "+center);
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
        this.infoWindow(e);
    };

    /** 鼠标移出  解绑事件 */
    showInfoOut = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log("鼠标移出 "+center);
        map.clearInfoWindow();
    };


    infoWindow = (e) => {
        let data = e.target.C.data;
        let type = e.target.C.gpsType;
        let infoHtml = null;
        var title = '';
        var content = [];
        if (type === "bringInfo") {
            title = '桥梁信息<span style="font-size:11px;color:#F00;"></span>';
            content.push("地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
            content.push("电话：010-64733333");
            content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
            content.join("<br/>");
        } else if (type === "dires") {
            title = '<span style="font-size:11px;color:#F00;">病害信息</span>';
            content.push("地址：北京市朝阳区北京市朝阳区");
            content.push("电话：010-64733333");
            content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
            content.join("<br/>");
        } else if (type === "track") {
            title = '巡查信息<span style="font-size:11px;color:#F00;"></span>';
            content.push("地址：北京市朝阳区阜北京市朝阳区");
            content.push("电话：010-");
            content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
            content.join("<br/>");
        } else if (type === "danger") {
            title = '<span style="font-size:11px;color:#F00;">三危信息</span>';
            content.push("地址：北京市朝阳区");
            content.push("电话：北京市朝阳区");
            content.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
            content.join("<br/>");
        }
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];

        //创建信息窗体
        var infoWindow = new window.AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: createInfoWindow(title, content.join("<br/>"), map),
            offset: new window.AMap.Pixel(16, -45)
        });

        infoWindow.open(map, center); //信息窗体打开
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