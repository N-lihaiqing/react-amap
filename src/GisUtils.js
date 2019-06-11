
let infoWindow;

export function GisClick(e) {
    let text = '您在 [ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ] 的位置双击了地图！';
    console.log(text);
    addMarker(e,{
        info:'地址：研祥城市广场',
        phone:'联系方式：13109535228',
        imgUrl:'http://tpc.googlesyndication.com/simgad/5843493769827749134'
    });

}
// 自定义标注
export function addMarker(e,message) {
    let marker = new window.AMap.Marker({
        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: [e.lnglat.getLng(),e.lnglat.getLat()],
        offset: new window.AMap.Pixel(-13, -30)
    });
    marker.setMap(window.map);
    openInfoWindow(message);
    marker.on('click',function () {
        infoWindow.open(window.map,marker.getPosition());
    });
    //window.AMap.event.addListener(marker, 'click',openInfoWindow(marker,message) );
    window.AMap.event.addListener(marker, 'mouseout',closeInfoWindow );
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

