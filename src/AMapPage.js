import React, {Component} from 'react';
import axios from "axios";
import css from "./MapStyle.css";
import {onComplete, onError, createInfoWindow, customRuler} from "./component";

let map = null,marker = null, ruler = null;

class AMapPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            turnOn: false,
        }
    }

    componentDidMount() {
        let that = this;
        axios.get(`https://webapi.amap.com/maps?v=1.4.11&key=0325e3d6d69cd56de4980b4f28906fd8`)
            .then(function () {
                let AMap = window.AMap;
                let markerObj, mapObj = new AMap.Map("allmap", {
                    resizeEnable: true,
                    doubleClickZoom: true,  //双击放大
                    center: [114.127277, 22.53317],
                    zoom: 10
                });

                marker = markerObj;
                map = mapObj;
                map.setFitView();
                window.map = map;

                // that.initMapPlugin();
                that.initMap();
            });
    }

    componentWillMount() {
    }

    initMapPlugin = () => {

        /** 初始化测试工具 */
        map.plugin(["AMap.RangingTool"],function(){
            ruler = new window.AMap.RangingTool(map, customRuler());
            window.AMap.event.addListener(ruler,"end",function(e){
                ruler.turnOn();//关闭
            });
            ruler.turnOff();
        });

        /*路线规划*/
        map.plugin("AMap.Driving", function() {
            let driving = new window.AMap.Driving({
                // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                policy: window.AMap.DrivingPolicy.LEAST_TIME,
                map:map,
            });

            const startLngLat = [114.064408, 22.548489]
            const endLngLat = [114.064516, 22.548423]

            driving.search(startLngLat, endLngLat, function (status, result) {
                // 未出错时，result即是对应的路线规划方案
            });

        });

        /*地图控件*/
        map.plugin([
            'AMap.ToolBar',
            'AMap.Scale',
            'AMap.MapType',
        ], function(){
            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            map.addControl(new window.AMap.ToolBar());

            // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
            map.addControl(new window.AMap.Scale());

            /*// 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
            map.addControl(new window.AMap.OverView({isOpen:false}));*/

            // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
            map.addControl(new window.AMap.MapType());

        });
    };


    location = () =>{
        /*定位控件*/
        map.plugin('AMap.Geolocation', function() {
            const geolocation = new window.AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 10000,
                //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: true,
                //  定位按钮的排放位置,  RB表示右下
                buttonPosition: 'RB'
            });

            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            window.AMap.event.addListener(geolocation, 'complete', onComplete);

            function onComplete (data) {

                let content=[];
                let title = '定位成功<span style="font-size:11px;color:#F00;"></span>';
                content.push("地址："+data.formattedAddress);
                content.push("纬度："+data.position.lat);
                content.push("经度："+data.position.lng);
                content.join("<br/>");

                //创建信息窗体
                let infoWindow = new window.AMap.InfoWindow({
                    isCustom: true,  //使用自定义窗体
                    content: createInfoWindow(title, content.join("<br/>"), map),
                    offset: new window.AMap.Pixel(16, -45)
                });

                let center = [data.position.lng, data.position.lat];
                infoWindow.open(map, center); //信息窗体打开
            }
        })
    };


    initMap = () => {
        let lnglats = [
            [114.06391, 22.548443],
            [114.064134, 22.548172],
            [114.064507, 22.548168],
            [114.064826, 22.548089]
        ];

        // this.addMarker(lnglats); // 实例化点标记
        // this.polyline();
        this.circle(); //初始化矢量图层
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
                radius: 1000, //半径
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
            circle.on('mouseover', this.showInfoOver);
            circle.on('mouseout', this.showInfoOut);
            circle.on('click', this.mapClickOver);
        }
        // 缩放地图到合适的视野级别
        map.setFitView([circle]);
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
        debugger;
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        let data = e.target.C.data;
        let type = e.target.C.gpsType;
        let infoHtml = null;
        let title = '';
        let content = [];
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
        } else if(type === "area"){
            title = '区域信息<span style="font-size:11px;color:#F00;"></span>';
            content.push(center);
            content.join("<br/>");
        }

        if(content){
            let center = [e.lnglat.getLng(), e.lnglat.getLat()];

            //创建信息窗体
            let infoWindow = new window.AMap.InfoWindow({
                isCustom: true,  //使用自定义窗体
                content: createInfoWindow(title, content.join("<br/>"), map),
                offset: new window.AMap.Pixel(16, -45)
            });

            infoWindow.open(map, center); //信息窗体打开
        }
    };

    setTurn = () => {
        if(this.state.turnOn){
            this.setState({turnOn: false});
            ruler.turnOff();
        } else {
            this.setState({turnOn: true});
            ruler.turnOn();
        }

    };


    render() {


        const mapBody = {
            width:'100%',
            height:  document.body.offsetHeight-30
        };

        return (
            <div>
                <div>
                    <div id='allmap' style={mapBody}/>
                </div>
                <div>
                    <button onClick={this.location}>定位</button>
                    <button onClick={this.setTurn.bind(this)}>{this.state.turnOn ? "关闭测距" : "开启测距"}</button>
                </div>
            </div>
        );
    }


}

export default AMapPage;