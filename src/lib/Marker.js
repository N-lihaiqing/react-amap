import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMarker, updateMarker } from './api';
const __com__ = 'Marker';
//const debug = console.log;
const debug = () => {};

export class Marker extends Component {
  static propTypes = {
    __map__: PropTypes.object,
    options: PropTypes.object,
    events: PropTypes.object
    //   zoom: PropTypes.number, // 10, //设置地图显示的缩放级别
    //   center: PropTypes.array, // [116.397428, 39.90923]，//设置地图中心点坐标
    //   layers: PropTypes.array, // [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
    //   mapStyle: PropTypes.string, // 'amap://styles/whitesmoke',  //设置地图的显示样式
    //   viewMode: PropTypes.string, // '2D',  //设置地图模式
    //   lang: PropTypes.string, // 'zh_cn',  //设置地图语言类型
    //   events: PropTypes.object, // {'click': function}, // 事件map
  };

  constructor() {
    super();
    this.refElement = null;
    this.entity = null;
    debug(__com__, 'constructor', this.entity);
  }

  componentWillMount() {
    debug(__com__, 'componentWillMount', this.props.children, this.entity);
  }

  componentDidMount() {
    debug(__com__, 'componentDidMount', this.props.children, this.entity);
    let { __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this.entity = createMarker(opts, events);
    if (this.entity) {
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  componentWillReceiveProps(nextProps) {
    debug(__com__, 'componentWillReceiveProps', this.props.children, this.entity);
  }

  componentWillUpdate() {
    debug(__com__, 'componentWillUpdate', this.props.children, this.entity);
  }

  componentDidUpdate(prevProps) {
    debug(__com__, 'componentDidUpdate', this.props.children, this.entity);
    let { __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    if (!this.entity) {
      this.entity = createMarker(opts, events);
      if (this.entity) {
        if (this.props.refer) this.props.refer(this.entity);
      }
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__,
      content: prevProps.children
    };
    updateMarker(this.entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    debug(__com__, 'componentWillUnmount', this.props.children, this.entity);
    if (this.entity) {
      //   this.entity.clearMap();
      this.entity.stopMove();
      this.entity.setMap(null);
      this.entity = null;
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   debug(__com__, 'shouldComponentUpdate', this.entity);
  //   let { AMap: oldAMap, refer: oldRefer, options: oldOptions, events: oldEvents } = this.props;
  //   let { AMap: newAMap, refer: newRefer, options: newOptions, events: newEvents } = nextProps;
  //   if (oldAMap === newAMap && oldRefer === newRefer && oldOptions === newOptions && oldEvents === newEvents) {
  //     debug(__com__, 'shouldComponentUpdate', false);
  //     return false;
  //   }
  //   debug(__com__, 'shouldComponentUpdate', true);
  //   return true;
  // }
  render() {
    debug(__com__, 'render', this.entity);
    return null;
  }
}

export default Marker;
