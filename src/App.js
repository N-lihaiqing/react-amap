import React, { Component } from 'react';
import cx from 'classnames';
import './App.css';

import loadJs from './lib/loadScript';
import { loadMap } from './lib/api';
import Map from './lib/Map';
import Marker from './lib/Marker';
import MassMarks from './lib/MassMarks';
import LayerTraffic from './lib/LayerTraffic';
import Polygon from './lib/Polygon';
import Polyline from './lib/Polyline';
import Circle from './lib/Circle';
import InfoWindow from './lib/InfoWindow';
import AMapPage from './AMapPage';

class MarkerTest extends Component {
  constructor() {
    super();
    this.state = {};
    this.setMapRefer = this.setMapRefer.bind(this);
    this.setMarkerRefer = this.setMarkerRefer.bind(this);
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      this.setState({ AMap });
    });
  }
  setMapRefer (refer) {
    this.mapRefer = refer;
    window.$map = this.mapRefer;
    console.log('setMapRefer:', this.mapRefer, this.markerRefer);
  }
  setMarkerRefer (refer) {
    this.markerRefer = refer;
    window.$marker = this.markerRefer;
    console.log('setMarkerRefer:', this.mapRefer, this.markerRefer);
  }

  render() {
    let center = [116.39, 39.9];
    window.$map = this.mapRefer;
    window.$marker = this.markerRefer;
    console.log('render:', this.mapRefer, this.markerRefer);
    let markerIcon = 'https://webapi.amap.com/theme/v1.3/markers/n/markb.png';
    switch (this.state.markerIndex) {
      case 1: markerIcon = 'http://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png'; break;
      case 2: markerIcon = 'http://a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png'; break;
      default:
      case 0: markerIcon = '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png'; break;
    }
    return (
      <div>
      <div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Marker图标:</span>
          <span onClick={() => this.setState({ markerIndex:0 })}>
            Marker-0
          </span>
          <span onClick={() => this.setState({ markerIndex:1 })}>
            Marker-1
          </span>
        </div>
        <Map
          refer={this.setMapRefer}
          style={{ width: 1200, height: 800 }}
          options={{ center, zoom:13 }}
        >
          <LayerTraffic options={{ interval:20,opacity:0.8 }} />
          <Marker
            refer={this.setMarkerRefer}
            options={{
              icon: markerIcon,
              position: center
            }}
          />
        </Map>
      </div>
      </div>
    );
  }

}


class MarkerCarMoveTest extends Component {
  constructor() {
    super();
    this.state = {};
    this.setMapRefer = this.setMapRefer.bind(this);
    this.mapDblclick = this.mapDblclick.bind(this);
    this.carMoving = this.carMoving.bind(this);
    this.logging = this.logging.bind(this);
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let satellite = new AMap.TileLayer.Satellite();
      let roadNet = new AMap.TileLayer.RoadNet();
      let traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 5 //刷新间隔，默认180s
      });

      let lineArr = [];
      let lngX = 116.397428, latY = 39.90923;        
      lineArr.push(new AMap.LngLat(lngX, latY));
      for (let i = 1; i < 4; i++) {
        lngX = lngX + Math.random() * 0.05;
        if (i % 2) {
            latY = latY + Math.random() * 0.0001;
        } else {
            latY = latY + Math.random() * 0.06;
        }
        lineArr.push(new AMap.LngLat(lngX, latY));
      }
  
      let carOffset = new AMap.Pixel(-26, -13);
      this.setState({ AMap, lineArr, carOffset });
    });
  }
  setMapRefer (refer) {
    this.mapRefer = refer;
  }

  mapDblclick() {
    this.setState({msg:'双击了Map!'});
  }
  carMoving(e) {
    this.setState({msg: '车在开', passedPath: e.passedPath});
  }
  logging(e) {
    this.setState({msg: 'log:'+JSON.stringify(e.data)});
  }

  render() {
    console.log('mapRefer:', this.mapRefer && this.mapRefer.getLayers());
    let markerIcon = 'https://webapi.amap.com/theme/v1.3/markers/n/markb.png';
    switch (this.state.markerIndex) {
      case 1: markerIcon = 'https://webapi.amap.com/theme/v1.3/markers/n/markr.png'; break;
      case 2: markerIcon = 'https://webapi.amap.com/theme/v1.3/markers/n/markr.png'; break;
      default:
      case 0: markerIcon = 'https://webapi.amap.com/theme/v1.3/markers/n/markb.png'; break;
    }
    return (
      <div>
      <div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Map位置:</span>
          <input type='button' onClick={() => this.setState({ center: [116.39, 39.9] })} value='北京' />
          <span onClick={() => this.setState({ center: [115.39, 38.9] })}>
            北京-1
          </span>
          <span onClick={() => this.setState({ center: [114.39, 37.9] })}>
            北京-2
          </span>
        </div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Marker位置:</span>
          <span onClick={() => this.setState({ showMarker: !this.state.showMarker })}>
            {this.state.showMarker && '隐藏'}
            {!this.state.showMarker && '显示'}
          </span>
          <span onClick={() => this.setState({ position: [116.39, 39.9] })}>
            北京
          </span>
          <span onClick={() => this.setState({ position: [115.39, 38.9] })}>
            北京-1
          </span>
          <span onClick={() => this.setState({ position: [114.39, 37.9] })}>
            北京-2
          </span>
        </div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Marker图标:</span>
          <span onClick={() => this.setState({ markerIndex:0 })}>
            Marker-0
          </span>
          <span onClick={() => this.setState({ markerIndex:1 })}>
            Marker-1
          </span>
        </div>
        <div style={{margin:2}}>
          <input style={{margin:2, padding:2}} type='button' onClick={() => {
            if (this.state.carEntity) this.state.carEntity.moveAlong(this.state.lineArr, 1500);
          }} value='开始' />
          <input style={{margin:2, padding:2}} type='button' onClick={() => {
            if (this.state.carEntity) this.state.carEntity.pauseMove();
          }} value='暂停' />
          <input style={{margin:2, padding:2}} type='button' onClick={() => {
            if (this.state.carEntity) this.state.carEntity.resumeMove();
          }} value='继续' />
          <input style={{margin:2, padding:2}} type='button' onClick={() => {
            if (this.state.carEntity) this.state.carEntity.stopMove();
          }} value='停止' />
        </div>
        <div style={{margin:2}}>
          {'消息:'+this.state.msg}
        </div>
        <Map
          refer={this.setMapRefer}
          style={{ width: 1200, height: 800 }}
          options={{ center: this.state.center, zoom:13 }}
          events={{
            click:this.logging,
            dblclick: this.mapDblclick,
          }}
      >
          <LayerTraffic options={{ interval:20,opacity:0.8 }} />
          {this.state.showMarker &&
          <Marker
            options={{
              icon: markerIcon,
              position: this.state.position || [116.405467, 39.907761]
            }}
            events={{
              click:this.logging
            }}
          >
          </Marker>
          }
          {this.state.showMarker &&
          <Marker
            options={{
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/markb.png',
              position: [116.385428, 39.92723],
              content:'<div class="marker-route marker-marker-bus-from"></div>',
              label: {
                offset: this.state.AMap && new this.state.AMap.Pixel(-30, -30),
                content: "我是marker的label标签"
              }
            }}
            events={{
              click:this.logging
            }}
          />
          }
          <Marker
            refer={(entity) => this.setState({carEntity: entity})}
            options={{
              position: [116.397428, 39.90923],
              icon: "https://webapi.amap.com/images/car.png",
              offset: this.state.carOffset,
              autoRotation: true
            }}
            events={{
              moving:this.carMoving
            }}
          />
          <Polyline
            options={{
              path: this.state.lineArr,
              strokeColor: "#00A",  //线颜色
              // strokeOpacity: 1,     //线透明度
              strokeWeight: 3,      //线宽
              // strokeStyle: "solid"  //线样式
            }}
            events={{
              click:this.logging
            }}
          />
          <Polyline
            options={{
              // path: lineArr,
              path:this.state.passedPath,
              strokeColor: "#F00",  //线颜色
              // strokeOpacity: 1,     //线透明度
              strokeWeight: 3,      //线宽
              // strokeStyle: "solid"  //线样式
            }}
            events={{
              click:this.logging
            }}
          />
        </Map>
      </div>
      </div>
    );
  }

}

class MassMarkTest extends Component {
  constructor() {
    super();
    this.state = {};
    this.mapDblclick = this.mapDblclick.bind(this);
    this.mapClick = this.mapClick.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
    this.setMapRefer = this.setMapRefer.bind(this);
    this.setMassRefer = this.setMassRefer.bind(this);
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let style = [{
        url: 'https://a.amap.com/jsapidemos/static/images/mass0.png',
        anchor: new AMap.Pixel(16, 16),
        size: new AMap.Size(21, 21)
      },{
        url: 'https://a.amap.com/jsapidemos/static/images/mass1.png',
        anchor: new AMap.Pixel(24, 24),
        size: new AMap.Size(17, 17)
      },{
        url: 'https://a.amap.com/jsapidemos/static/images/mass2.png',
        anchor: new AMap.Pixel(23, 23),
        size: new AMap.Size(5, 5)
      }];

      this.setState({ AMap });
    });
    loadJs('https://a.amap.com/jsapidemos/static/citys.js','js').then(ret => {
      console.log('ret:', ret, window.citys);
      // this.setState({citys:window.citys});
      let citys = window.citys.map ((item, index) => {
        return {...item, id: index};
      })
      this.setState({citys});
    })
  }

  getStyle() {
    if (!this.styles) {
      if (window.AMap) {
        this.styles = [{
          url: 'https://a.amap.com/jsapidemos/static/images/mass0.png',
          anchor: new window.AMap.Pixel(16, 16),
          size: new window.AMap.Size(21, 21)
        },{
          url: 'https://a.amap.com/jsapidemos/static/images/mass1.png',
          anchor: new window.AMap.Pixel(24, 24),
          size: new window.AMap.Size(17, 17)
        },{
          url: 'https://a.amap.com/jsapidemos/static/images/mass2.png',
          anchor: new window.AMap.Pixel(23, 23),
          size: new window.AMap.Size(5, 5)
        }];
      }
    }
    return this.styles;
  }

  mapDblclick() {
    if (this.massRefer) {
      this.massRefer.show();
      this.massRefer.setData(this.state.citys);
    }
    this.setState({msg:'双击了Map!'});
  }
  mapClick() {
    if (this.mapRefer) {
      let layers= this.mapRefer.getLayers();
      console.log('mapClick:', layers);
    }
  }
  changeStyle(item) {
    let style = (item.style+1) % 3;
    let data = this.state.citys
    let data2 = [...data];
    data2[item.id] = {...item, style};
    this.setState({citys:data2});
  }
  setMapRefer (refer) {
    this.mapRefer = refer;
  }
  setMassRefer (refer) {
    this.massRefer = refer;
  }

  render() {
    let massStyles = this.getStyle();
    return (
      <div>
      <div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Map位置:</span>
          <input type='button' onClick={() => this.setState({ center: [116.39, 39.9] })} value='北京' />
          <span onClick={() => this.setState({ center: [115.39, 38.9] })}>
            北京-1
          </span>
          <span onClick={() => this.setState({ center: [114.39, 37.9] })}>
            北京-2
          </span>
        </div>
        <div style={{margin:2}}>
          {'消息:'+this.state.msg}
        </div>
        <Map
          refer={this.setMapRefer}
          style={{ width: 1100, height: 800 }}
          options={{ center: this.state.center }}
          events={{
            // click:e=>this.setState({msg: '点击了Map'}),
            dblclick: this.mapDblclick,
            click:this.mapClick
          }}
      >
          <MassMarks
            refer={this.setMassRefer}
            options={{
              data: this.state.citys,
              opacity:0.8,
              zIndex: 111,
              cursor:'pointer',
              style: massStyles
            }}
            events={{
              click:e=> {
                console.log('e:', e);
                this.changeStyle(e.data);
                this.setState({msg: '点击了MassMarks:'+JSON.stringify(e.data)})
              }
            }}
          >
          </MassMarks>
        </Map>
      </div>
      </div>
    );
  }

}

class PolygonTest extends Component {
  constructor() {
    super();
    this.state = {};
    this.mapDblclick = this.mapDblclick.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let roadNet = new AMap.TileLayer.RoadNet();
      let traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 15 //刷新间隔，默认180s
      });
  
      this.setState({ AMap, layers: [roadNet, traffic], poly: 0 });
    });
  }

  mapDblclick() {
    this.setState({msg:'双击了Map!'});
  }
  changeStyle() {
    this.setState({poly:1})
  }

  render() {
    let poly0 = [//多边形覆盖物节点坐标数组
      [116.403322, 39.920255],
      [116.410703, 39.897555],
      [116.402292, 39.892353],
      [116.389846, 39.891365]
    ];
    let poly1 = [//多边形覆盖物节点坐标数组
      [116.404322, 39.920355],
      [116.411703, 39.897355],
      [116.402392, 39.892453],
      [116.381946, 39.881465]
    ];
    let poly = (this.state.poly == 0) ? poly0: poly1;

    return (
      <div>
      <div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改Map位置:</span>
          <input type='button' onClick={() => this.setState({ poly:0 })} value='poly0' />
          <input type='button' onClick={() => this.setState({ poly:1 })} value='poly1' />
        </div>
        <div style={{margin:2}}>
          {'消息:'+this.state.msg}
        </div>
        <Map
          style={{ width: 1100, height: 800 }}
          options={{ center: this.state.center, layers: this.state.layers }}
          events={{
            // click:e=>this.setState({msg: '点击了Map'}),
            dblclick: this.mapDblclick,
          }}
      >
          <Polygon
            options={{
              path: poly,
              strokeColor: "#FF33FF", //线颜色
              strokeOpacity: 0.2, //线透明度
              strokeWeight: 3,    //线宽
              fillColor: "#1791fc", //填充色
              fillOpacity: 0.35,//填充透明度
              extData: {poly:this.state.poly}
              }}
            events={{
              click:e=> {
                console.log('e:', e);
                this.changeStyle(e.data);
                this.setState({msg: '点击了Poly:'+JSON.stringify(e.data)})
              }
            }}
          />
        </Map>
      </div>
      </div>
    );
  }
}

class CircleTest extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let roadNet = new AMap.TileLayer.RoadNet();
      let traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 15 //刷新间隔，默认180s
      });
  
      this.setState({ AMap, layers: [roadNet, traffic], center: [116.403322, 39.920255], radius: 1000 });
    });
  }

  mapDblclick = (e) => {
    let center = [e.lnglat.getLng(), e.lnglat.getLat()];
    this.setState({msg:'双击了Map!', center});
  }
  mapClick = (e) => {
    let center = [e.lnglat.getLng(), e.lnglat.getLat()];
    this.setState({msg:'双击了Map!', center});
  }
  changeRadius200 = () => {
    this.setState({radius:500})
  }
  changeRadius1000 = () => {
    this.setState({radius:2000})
  }

  render() {
    let { center, radius} = this.state;
    return (
      <div>
      <div>
        <div style={{margin:2}}>
          <span style={{marginRight:2}}>改变半径radius:</span>
          <input type='button' onClick={this.changeRadius200} value='radius200' />
          <input type='button' onClick={this.changeRadius1000} value='radius1000' />
        </div>
        <div style={{margin:2}}>
          {'消息:'+this.state.msg}
        </div>
        <Map
          style={{ width: 1100, height: 800 }}
          options={{ center: this.state.center, layers: this.state.layers }}
          events={{
            click: this.mapClick,
            dblclick: this.mapDblclick,
          }}
      >
          <Circle
            options={{
              center,
              radius,
              strokeColor: "#FF33FF", //线颜色
              strokeOpacity: 0.2, //线透明度
              strokeWeight: 3,    //线宽
              fillColor: "#1791fc", //填充色
              fillOpacity: 0.35,//填充透明度
              }}
            events={{
              click:this.mapClick
            }}
          />
        </Map>
      </div>
      </div>
    );
  }
}

class InfoWindowTest extends Component {
  constructor() {
    super();
    this.state = {};
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let roadNet = new AMap.TileLayer.RoadNet();
      let center1 = new AMap.LngLat(116.403322, 39.920255);
      let center2 = new AMap.LngLat(116.405522, 39.921265);
      let offset = new AMap.Pixel(Math.random() * 10, Math.random() * 10)
      this.setState({ AMap, layers: [roadNet], center: center1, center1, center2, offset });
    });
  }
  closeInfoWindow(evt) {
    console.log ('close infowindow!');
    this.setState({isOpen:false})
  }

  render() {
    const html = `<div><h4>Greetings</h4><p>This is content of this info window</p><p>Click 'Change Value' Button:</p></div>`;
    const size = {
      width: 250 + Math.random() * 20,
      height: 140 + Math.random() * 20,
    }

    return (
      <div>
      <div>
        <div style={{margin:2}}>
          <input type='button' onClick={() => this.setState({ isOpen:true })} value='显示' />
          <input type='button' onClick={() => this.setState({ isOpen:false })} value='隐藏' />
          <input type='button' onClick={() => this.setState({ center: this.state.center1 })} value='center1' />
          <input type='button' onClick={() => this.setState({ center: this.state.center2 })} value='center2' />
        </div>
        <Map
          style={{ width: 1100, height: 800 }}
          options={{ center: this.state.center, layers: this.state.layers }}
      >
      {this.state.isOpen && (
          <InfoWindow
            options={{
              position: this.state.center,
              isCustom:false,
              content:html,
              size,
              offset: this.state.offset
              }}
            events={{
              close: this.closeInfoWindow
            }}
          />
          )}
        </Map>
      </div>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <AMapPage/>
        {/*<div>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'marker')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'marker'})}> MarkerTest </span>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'markercarmove')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'markercarmove'})}> 移动的汽车(MarkerCarMoveTest) </span>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'massmarks')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'massmarks'})}> MassMarksTest </span>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'polygon')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'polygon'})}> PolygonTest </span>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'circle')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'circle'})}> CircleTest </span>
          <span style={{padding:5, margin: 5, backgroundColor:(this.state.test === 'infowindow')?'#ff0':'#fff'}} onClick={()=>this.setState({test: 'infowindow'})}> InfoWindowTest </span>
        </div>
        <div>
          {this.state.test === 'marker' &&
          <MarkerTest />
          }
          {this.state.test === 'markercarmove' &&
          <MarkerCarMoveTest />
          }
          {this.state.test === 'massmarks' &&
          <MassMarkTest />
          }
          {this.state.test === 'polygon' &&
          <PolygonTest />
          }
          {this.state.test === 'circle' &&
          <CircleTest />
          }
          {this.state.test === 'infowindow' &&
          <InfoWindowTest />
          }

        </div>*/}
      </div>
    );
  }
}

export default App;
