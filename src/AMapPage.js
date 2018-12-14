import React, {Component} from 'react';
import {loadMap} from "./lib/api";
import Map from "./lib/Map";
import Circle from "./lib/Circle";

class AMapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
            let roadNet = new AMap.TileLayer.RoadNet();
            let traffic = new AMap.TileLayer.Traffic({
                autoRefresh: true, //是否自动刷新，默认为false
                interval: 15 //刷新间隔，默认180s
            });

            this.setState({
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
                zoom:11, //初始化地图层级
            });
        });
    }


    mapDblclick = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        this.setState({msg: '双击了Map!', center});
    };
    mapClick = (e) => {
        let center = [e.lnglat.getLng(), e.lnglat.getLat()];
        this.setState({msg: '单击了Map!', center});
    };

    mouseMove = (e) => {
      alert(e);
    };

    render() {
        let {center, radius} = this.state;
        return (
            <div>
                <div>
                    <div style={{margin: 2}}>
                        {'消息:' + this.state.msg}
                    </div>
                    <Map
                        style={{width: 1600, height: 800}}
                        options={{center: this.state.center, layers: this.state.layers}}
                        events={{
                            click: this.mapClick,
                            dblclick: this.mapDblclick,
                            move: this.mouseMove,
                        }}
                    >
                    </Map>
                </div>
            </div>
        );
    }


}

export default  AMapPage;