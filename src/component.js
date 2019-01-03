
let district = null, polygons=[], ruler = null;
let disProvince = null;

//解析定位结果
export async function onComplete(data) {
    document.getElementById('status').innerHTML='定位成功'
    let str = [];
    str.push('定位结果：' + data.position);
    str.push('定位类别：' + data.location_type);
    if(data.accuracy){
        str.push('精度：' + data.accuracy + ' 米');
    }//如为IP精确定位结果则没有精度信息
    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    document.getElementById('result').innerHTML = str.join('<br>');
}

//解析定位错误信息
export async function onError(data) {
    document.getElementById('status').innerHTML='定位失败'
    document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
}

// 信息窗口弹出样式修改
export function createInfoWindow(title, content, map){
    let info = document.createElement("div");
    info.className = "custom-info input-card content-window-card";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    let top = document.createElement("div");
    let titleD = document.createElement("div");
    let closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "https://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    let middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    let bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    let sharp = document.createElement("img");
    sharp.src = "https://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

// 自定义测距样式
export function customRuler(){
    //自定义样式
    let startMarkerOptions= {
        icon: new window.AMap.Icon({
            size: new window.AMap.Size(19, 31),//图标大小
            imageSize:new window.AMap.Size(19, 31),
            image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
        })
    };
    let endMarkerOptions = {
        icon: new window.AMap.Icon({
            size: new window.AMap.Size(19, 31),//图标大小
            imageSize:new window.AMap.Size(19, 31),
            image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
        }),
        offset: new window.AMap.Pixel(-9, -31)
    };
    let midMarkerOptions = {
        icon: new window.AMap.Icon({
            size: new window.AMap.Size(19, 31),//图标大小
            imageSize:new window.AMap.Size(19, 31),
            image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
        }),
        offset: new window.AMap.Pixel(-9, -31)
    };
    let lineOptions = {
        strokeStyle: "solid",
        strokeColor: "#FF33FF",
        strokeOpacity: 1,
        strokeWeight: 2
    };
    let rulerOptions = {
        startMarkerOptions: startMarkerOptions,
        midMarkerOptions:midMarkerOptions,
        endMarkerOptions: endMarkerOptions,
        lineOptions: lineOptions
    };

    return rulerOptions;
}

/* 地图定位控件 */
export function location(callback) {
        /*定位控件*/
        window.map.plugin('AMap.Geolocation', function() {
            const geolocation = new window.AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 10000,
                //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: false,
                //  定位按钮的排放位置,  RB表示右下
                buttonPosition: 'RB',
                showMarker:false,
                showButton:false
            });

            window.map.addControl(geolocation);
            geolocation.getCurrentPosition();
            window.AMap.event.addListener(geolocation, 'complete', onComplete);

            function onComplete (data) {


                window.startLocation = {
                    keyword:data.formattedAddress,
                    city:data.addressComponent.city
                };

                window.center = [data.position.lng,data.position.lat];

                if(callback){

                    callback(data);
                }

            }
        })
}

//关闭信息窗体
function closeInfoWindow(){
    window.map.clearInfoWindow();
}


export function initGovernmentArea() {
    //叠加云数据图层
    window.AMap.service('AMap.DistrictSearch', function () {
        //加载行政区划插件
        if(!district){
            //实例化DistrictSearch
            let opts = {
                subdistrict: 0,   //获取边界不需要返回下级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: 'district'  //查询行政级别为 市
            };
            district = new window.AMap.DistrictSearch(opts);
        }
    });
}

export function drawBounds(val) {

    //行政区查询
    district.setLevel('district'); //city  province   country
    district.search(val, function(status, result) {
        if(status == "complete"){
            window.map.remove(polygons);   //清除上次结果
            polygons = [];
            let bounds = result.districtList[0].boundaries;
            let code = result.districtList[0].adcode;
            let city = result.districtList[0].name;

            let depth = city == '西安市' ? 2 : 3;

            disProvince && disProvince.setMap(null);

            disProvince = new window.AMap.DistrictLayer.Province({
                zIndex: 12,
                adcode: [code],
                depth: depth,
                styles: {
                    // 'fill': function (properties) {
                    //     var adcode = properties.adcode;
                    //     return getColorByAdcode(adcode);
                    // },
                    'province-stroke': 'cornflowerblue',
                    'city-stroke': '#0091ea', // 中国地级市边界
                    'county-stroke': 'rgba(255,255,255,0.5)' // 中国区县边界
                }
            });
            disProvince.setMap(window.map);
            window.map.setFitView();

            // if (bounds) {
            //     for (let i = 0, l = bounds.length; i < l; i++) {
            //         //生成行政区划polygon
            //         let polygon = new window.AMap.Polygon({
            //             strokeWeight: 3,
            //             path: bounds[i],
            //             fillOpacity: 0,
            //             fillColor: '#0091ea',
            //             strokeColor: '#0091ea'
            //         });
            //         polygons.push(polygon);
            //     }
            // }
            // window.map.add(polygons);
            // window.map.setFitView(polygons);//视口自适应
        } else {
            console.log(" 无数据 ");
        }
    });
}

export function getColorByAdcode(adcode) {
    // 颜色辅助方法
    let colors = {};
    if (!colors[adcode]) {
        // let gb = Math.random() * 155 + 50;
        let gb = 255;
        colors[adcode] = 'rgb(' + gb + ',' + gb + ',255)';
    }

    return colors[adcode];
}

export function rangingTool () {
    /** 初始化测试工具 */
    window.map.plugin(["AMap.RangingTool"],function(){
        ruler = new window.AMap.RangingTool(window.map, customRuler());
        window.AMap.event.addListener(ruler,"end",function(e){
            ruler.turnOn();//关闭
        });
        ruler.turnOff();
    });
}

export function rulerOffOrOn(obj) {
    if("on" == obj){
        ruler.turnOn();
    } else {
        ruler.turnOff();
    }
}

export function initToolBar() {
    window.AMap.plugin('AMap.ToolBar',function(){
        let toolopt = {
            offset :new window.AMap.Pixel(10,10),//相对于地图容器左
            position : 'RB',
            ruler : true,//标尺键盘是否可见，默认为true
            noIpLocate : false,//定位失败后，是否开启IP定位，
            locate : false,//是否显示定位按钮，默认为false
            liteStyle : false,//是否使用精简模式，默认为false
            direction : false,//方向键盘是否可见，默认为true
            autoPosition : true,//是否自动定位，即地图初始化加
            locationMarker : window.AMap.Marker({map: window.map}),
            useNative : false
        };
        let toolbar  = new window.AMap.ToolBar(toolopt);
        toolbar.hideRuler();
        window.map.addControl(toolbar)
    })
}

/** 地图缩放 */
export function setZoom(val) {
    if(val == "in"){
        window.map.zoomIn();
    } else if(val == "out"){
        window.map.zoomOut();
    }
}

/** 地图缩放，当前位置放到地图最中间 */
export function mapZoom(e, val) {
    if(val == "in"){
        window.map.zoomIn();
    } else if(val == "out"){
        window.map.zoomOut();
    }
    let pixel = new window.AMap.Pixel(e.clientX, e.clientY);
    let lnglat = window.map.containerToLngLat(pixel);
    window.map.setCenter(lnglat);
}


/** 地图类型切换 */
export function mapType(val) {
    /*if(val == "2D"){
        window.AMap.Map({
            viewMode:'2D',//开启3D视图,默认为关闭
            buildingAnimation:false,//楼块出现是否带动画
        });
    } else if (val == "3D"){
        window.AMap.Map({
            viewMode:'3D',//开启3D视图,默认为关闭
            buildingAnimation:true,//楼块出现是否带动画
        });
    }*/
}

/** 初始化地图插件 */
export function initPlugin() {
    /*地图控件*/
    window.map.plugin([
        // 'AMap.ToolBar',
        // 'AMap.Scale',
        // 'AMap.MapType',
        // 'AMap.ControlBar',
        'AMap.AdvancedInfoWindow',
        'AMap.DistrictLayer'
    ], function(){
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        // map.addControl(new window.AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        // map.addControl(new window.AMap.Scale());

        /*// 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        map.addControl(new window.AMap.OverView({isOpen:false}));*/

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        // map.addControl(new window.AMap.MapType());

        // window.map.addControl(new window.AMap.ControlBar({
        //     showZoomBar:false,
        //     showControlButton:true,
        //     position:{
        //         right:'10px',
        //         bottom:'120px'
        //     }
        // }));


        window.map.addControl(new window.AMap.AdvancedInfoWindow());
        window.map.addControl(new window.AMap.DistrictLayer())
    });
}

/**
 * 开启路线导航
 * @param condition 路线模式
 * @param startLocation 起始点位置
 * @param endLocation   终点位置
 */
export function startNavigate(condition,startLocation,endLocation) {

    if(window.driving){
        window.driving.clear();
    }

    let map = window.map;
    /*驾车路线规划*/
    if(condition==='Driving'){

        map.plugin("AMap.Driving", function() {
            window.driving = new window.AMap.Driving({
                policy: window.AMap.DrivingPolicy.LEAST_TIME,
                map:map,
            });

            window.driving.search([startLocation, endLocation], function (status, result) {

            });


        });
    }

    /*公交路线规划*/
    if(condition==='Transfer'){

        map.plugin("AMap.Transfer", function() {
            window.driving = new window.AMap.Transfer({
                map:map,
                city:window.startLocation.city
            });

            window.driving.search([startLocation, endLocation], function (status, result) {
            });

        });
    }

    /*步行路线规划*/
    if(condition==='Walking'){
        map.plugin("AMap.Walking", function() {
            window.driving = new window.AMap.Walking({
                map:map,
            });

            window.driving.search([startLocation, endLocation], function (status, result) {

            });

        });
    }

    /*骑行路线规划*/
    if(condition==='Riding'){
        map.plugin("AMap.Riding", function() {
            window.driving = new window.AMap.Riding({
                // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                policy: window.AMap.RidingPolicy.LEAST_TIME,
                map:map,
            });

            window.driving.search([startLocation, endLocation], function (status, result) {

            });

        });
    }

}

/**
 * 开启定位，初始化起点位置（视野移动）
 */
export function findPosition() {

    /*定位控件*/
    window.map.plugin('AMap.Geolocation', function () {
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
}

export function addMarkSign(e) {
    let imgPath = require('./image/d7.png'); //图片太大了
    let px = e.clientX;
    let py = e.clientY;
    let pixel = new window.AMap.Pixel(px, py);
    let lnglat = window.map.containerToLngLat(pixel);
    let gpsType = 'test';
    let markerType = 'makerSign';
    let marker = new window.AMap.Marker({
        position: lnglat,
        draggable: true,
        map: window.map,
        gpsType: gpsType,
        markerType: markerType,
        data: lnglat,
        label: {
            offset: new window.AMap.Pixel(20, 20),
            content: '自定义标记哦'
        }
        // icon: imgPath,
    });
    marker.setMap(window.map);
    marker.on('click', mapClickOver);
    marker.on('mouseover', showInfoOver);
    marker.on('mouseout', showInfoOut);
    mapZoom(e, "in");
}

/** 鼠标双击事件 */
export function mapDblclick (e){
    // let center = [e.lnglat.getLng(), e.lnglat.getLat()];
    // console.log("鼠标双击事件 " + center);
};

/** 鼠标单击覆盖物事件 */
export function mapClickOver (e) {
    let center = [e.lnglat.getLng(), e.lnglat.getLat()];
    console.log("鼠标单击事件 "+center);
    advancedInfoWindow(e);
};

/** 解绑覆盖物事件 */
export function mapClickOut (e){
    let center = [e.lnglat.getLng(), e.lnglat.getLat()];
    console.log("解绑覆盖物事件 "+center);
};

/** 鼠标移入事件 绑定事件 */
export function showInfoOver (e) {
    let center = [e.lnglat.getLng(), e.lnglat.getLat()];
    console.log("鼠标移入事件 "+center);
    infoWindow(e);
};

/** 鼠标移出  解绑事件 */
export function showInfoOut (e){
    let center = [e.lnglat.getLng(), e.lnglat.getLat()];
    console.log("鼠标移出 "+center);
    if(!e.target.C.markerType === 'makerSign'){
        window.map.clearInfoWindow();
    }
};

export function infoWindow (e) {
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
    } else {
        title = '测试信息<span style="font-size:11px;color:#F00;"></span>';
        content.push("地址：北京市朝阳区");
        content.push(center);
        content.join("<br/>");
    }

    if(content){
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];

        //创建信息窗体
        let infoWindow = new window.AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: createInfoWindow(title, content.join("<br/>"), window.map),
            offset: new window.AMap.Pixel(16, -45)
        });

        infoWindow.open(window.map, center); //信息窗体打开
    }
};

/** 带检索功能的信息窗体 */
export function advancedInfoWindow(e) {
    let data = e.target.C.data;
    let type = e.target.C.gpsType;

    const content = '<div class="info-title">高德地图</div>' +
        '<div class="info-content">' +
        '<img src="https://webapi.amap.com/images/amap.jpg">' +
        '高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。<br/>' +
        '<a target="_blank" href = "https://mobile.amap.com/">点击下载高德地图</a>' +
        '</div>';

    const infowindow = new window.AMap.AdvancedInfoWindow({
        content: content,
        placeSearch: true,
        asDestination: true,
        offset: new window.AMap.Pixel(0, -30)
    });

    const center = [e.lnglat.getLng(), e.lnglat.getLat()];
    if(!infowindow.getIsOpen()){
        infowindow.open(window.map, center);
    }
}
