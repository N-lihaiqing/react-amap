
let district = null, polygons=[], ruler = null;
let geolocation=null;

//解析定位结果
export async function onComplete(data) {
    document.getElementById('status').innerHTML='定位成功'
    var str = [];
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

                if(callback){

                    let startLocation = [];
                    startLocation.push(data.position.lng);
                    startLocation.push(data.position.lat);
                    sessionStorage.setItem('startLocation',startLocation);
                    sessionStorage.setItem('cityCode',data.addressComponent.citycode);
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
            var opts = {
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
            var bounds = result.districtList[0].boundaries;
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                    var polygon = new window.AMap.Polygon({
                        strokeWeight: 3,
                        path: bounds[i],
                        fillOpacity: 0.4,
                        fillColor: '',
                        strokeColor: '#0091ea'
                    });
                    polygons.push(polygon);
                }
            }
            window.map.add(polygons);
            window.map.setFitView(polygons);//视口自适应
        } else {
            console.log(" 无数据 ");
        }

    });
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
        var toolbar  = new window.AMap.ToolBar(toolopt);
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
        'AMap.ControlBar',
    ], function(){
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        // map.addControl(new window.AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        // map.addControl(new window.AMap.Scale());

        /*// 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        map.addControl(new window.AMap.OverView({isOpen:false}));*/

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        // map.addControl(new window.AMap.MapType());

        window.map.addControl(new window.AMap.ControlBar({
            showZoomBar:false,
            showControlButton:true,
            position:{
                right:'10px',
                bottom:'120px'
            }
        }));
    });
}