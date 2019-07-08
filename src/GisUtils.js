
let infoWindow;

let clickMarker = {
    icon : null,
    marker : null
};

let clickPoint = [];

let points = [{
        lon : 114.150362,
        lat : 22.597412,
        id : 1,
        img : require('./image/line.png'),
        icon : null
    },{
        lon : 114.139208,
        lat : 22.595353,
        id : 2,
        img : require('./image/disease.png'),
        icon : null
    }
];



export function GisClick(e) {
    let text = '您在 [ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ] 的位置双击了地图！';
    clickPoint.push(e.lnglat.getLng());
    clickPoint.push(e.lnglat.getLat());
    console.log(text);
    /*points.map(item =>{
        addMarker(item,{
            info:'地址：研祥城市广场',
            phone:'联系方式：13109535228',
            imgUrl:'http://tpc.googlesyndication.com/simgad/5843493769827749134'
        });
    });*/


    getAddress([e.lnglat.getLng(),e.lnglat.getLat()]);
}

export function addressCallback(status,result) {
    let data = {
        address : result.regeocode.formattedAddress,
        point : clickPoint
    };

    console.log(data);
}

export function getAddress(clickPoint) {
    window.map.clearMap();
    let marker = new window.AMap.Marker({
        position: clickPoint,
        offset: new window.AMap.Pixel(-13, -30)
    });
    marker.setMap(window.map);
    let geocoder = new window.AMap.Geocoder({});
    geocoder.getAddress(clickPoint, addressCallback)
}

// 自定义标注
export function addMarker(point,message) {

    let preIcon = new window.AMap.Icon({
        image: point.img,
        size: [ 20,  27],
        imageSize: [ 20, 27]
    });

    let heightIcon = new window.AMap.Icon({
        image: require('./image/upline.png'),
        size: [ 30,  40],
        imageSize: [ 30,  40]
    });

    let marker = new window.AMap.Marker({
        icon: preIcon,
        position: [point.lon,point.lat],
        offset: new window.AMap.Pixel(-13, -30)
    });
    point.icon = preIcon;
    marker.setExtData(point);
    marker.setMap(window.map);
    openInfoWindow(message);
    let isClicked = false;
    let flag = null;
    marker.on('click',  function(e){

        if(clickMarker.marker !== null){
            clickMarker.marker.setIcon(clickMarker.icon);
        }
        clickMarker = {
            marker : e.target,
            icon : e.target.getExtData().icon
        };

        flag = true;
        window.map.setCenter(e.target.getPosition());
        if(isClicked) return;
        //点击点高亮显示
        e.target.setIcon(heightIcon);
        isClicked = true;
    });
    marker.on('mouseover',function (e) {

        if(e.target.getIcon() !== heightIcon){
            flag = false;
            e.target.setIcon(heightIcon);
        }
        infoWindow.open(window.map,marker.getPosition());
    });
    marker.on('mouseout',function (e) {

        if(isClicked){
            !flag && e.target.setIcon(preIcon);
        }else{
            !isClicked && e.target.setIcon(preIcon);
        }

        closeInfoWindow();
    });
    marker.on('destroyed',function(e){
        isClicked &&　e.target.setIcon(preIcon);
        isClicked = false;
    })
}

//创建信息窗体
export function openInfoWindow(message) {

    let content = [];
    content.push(`<img src='${message.imgUrl}'/>${message.info}`);
    content.push(message.phone);
    infoWindow = new window.AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(content.join("<br/>")),
        offset: new window.AMap.Pixel(16, -45)
    });

}

//构建自定义信息窗体样式
function createInfoWindow(content) {
    let info = document.createElement("div");
    info.className = "custom-info input-card content-window-card";

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

//关闭信息窗体
export function closeInfoWindow() {

    window.map.clearInfoWindow();
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
            showMarker:true,
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

let lnglats1 = [
    [113.891574, 22.581393 ,'宝安区'], //宝安区
    [113.936543, 22.555591 ,'南山区'], //南山区
    [114.049679, 22.78319 ,'龙华'], //龙华
    [114.067292, 22.54342 ,'福田区'], //福田区
    [114.237683, 22.581593 ,'盐田区'], //盐田区
    [114.251004, 22.743083 ,'龙岗区'] //龙岗区
];

/** 圆形矢量图形 */
export function circle(map,lnglats = lnglats1){
    let circle = null;
    for (let i = 0; i < lnglats.length; i++) {
        circle = new window.AMap.Circle({
            center: new window.AMap.LngLat(lnglats[i][0], lnglats[i][1]),// 圆心位置
            radius: 3000, //半径
            strokeColor: "#FFF", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 0, //线粗细度
            fillColor: "#58AA55", //填充颜色
            fillOpacity: 0.75,//填充透明度
            gpsType: 'area',
            extData : lnglats[i][2]
        });
        circle.setMap(map);
        let overlayGroup = new window.AMap.OverlayGroup([circle]);

        let html = "";
        if (i == 1) {
            html = "宝安区"
        } else if (i == 2) {
            html = "南山区"
        } else if (i == 3) {
            html = "龙华区"
        } else if (i == 4) {
            html = "福田区"
        } else {
            html = "盐田区"
        }
    // 创建纯文本标记
        let text = new window.AMap.Text({
            text: html,
            textAlign: 'center', // 'left' 'right', 'center',
            verticalAlign: 'middle', //middle 、bottom
            draggable: true,
            cursor: 'pointer',
            angle: 10,
            style: {
                'background-color': 'transparent',
                'width': 'auto',
                'border-width': 0,
                'text-align': 'center',
                'font-size': '16px',
                'color': 'white'
            },
            position: [lnglats[i][0], lnglats[i][1]]
        });
        text.setMap(map);

        circle.on('mouseover',aggregationScroll(circle));
        circle.on('mouseout',function () {
            window.map.off('zoomstart',function () {
                alert('移除滚轮事件');
            });
        })
    }
}

function aggregationScroll(circle) {

    window.map.on('zoomstart',function () {
        let zoom = window.map.getZoom();
        console.log(circle.Le.extData);
        if(zoom>=12){
            circle.hide();
        }else if(zoom<=11){
            circle.show();
        }

    })
}




// 点聚合工具类测试
export function aggregation() {

    let markers = [];

    let points = [
        [114.150362,22.597412],
        [114.150362,22.605136],
        [114.139208,22.595353],
        [114.142554,22.604621],
        [114.135304,22.608225],
        [114.136977,22.598957],
        [114.127496,22.614403],
        [114.090128,22.650438],
        [114.081762,22.644776],
        [114.078973,22.655585],
        [114.099051,22.659188]
    ];

    points.map(item =>{
        markers.push(new window.AMap.Marker({
            position: item,
            content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
            offset: new window.AMap.Pixel(-15, -15)
        }))
    });

    let sts = [{
        url: require('./image/green.png'),
        size: new window.AMap.Size(64, 64),
        offset: new window.AMap.Pixel(-16, -16)
    }/*, {
        url: "https://a.amap.com/jsapi_demos/static/images/green.png",
        size: new window.AMap.Size(32, 32),
        offset: new window.AMap.Pixel(-16, -16)
    }, {
        url: "https://a.amap.com/jsapi_demos/static/images/orange.png",
        size: new window.AMap.Size(36, 36),
        offset: new window.AMap.Pixel(-18, -18)
    }, {
        url: "https://a.amap.com/jsapi_demos/static/images/red.png",
        size: new window.AMap.Size(48, 48),
        offset: new window.AMap.Pixel(-24, -24)
    }, {
        url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
        size: new window.AMap.Size(48, 48),
        offset: new window.AMap.Pixel(-24, -24)
    }*/];

    /*地图控件*/
    let cluster = new window.AMap.MarkerClusterer(window.map, markers, {
        styles: sts,
        gridSize: 80
    });
}





