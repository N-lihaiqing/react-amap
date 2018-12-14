import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createCircle, updateCircle } from './api';
const __com__ = 'Circle';
//const debug = console.log;
const debug = () => {};

export class Circle extends Component {
  static propTypes = {
    __map__: PropTypes.object,
    options: PropTypes.object,
    zoom: PropTypes.number, // 10, //设置地图显示的缩放级别
    center: PropTypes.array, // [116.397428, 39.90923]，//设置地图中心点坐标
    layers: PropTypes.array, // [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
    mapStyle: PropTypes.string, // 'amap://styles/whitesmoke',  //设置地图的显示样式
    viewMode: PropTypes.string, // '2D',  //设置地图模式
    lang: PropTypes.string, // 'zh_cn',  //设置地图语言类型
    events: PropTypes.object // {'click': function}, // 事件map
};

  constructor() {
    super();
    this.refElement = null;
    this.entity = null;
  }

  componentDidMount() {
    let { __map__, options, events, children } = this.props;
    let opts = { ...(options || {}), map: __map__ };
    this.entity = createCircle(opts, events);
    if (this.entity) {
      if (this.props.refer) this.props.refer(this.entity);
    }
}

  componentDidUpdate(prevProps) {
    let { __map__, options, events, children } = this.props;
    let opts = { ...(options || {}), map: __map__ };
    if (!this.entity) {
      this.entity = createCircle(opts, events);
      if (this.entity) {
        if (this.props.refer) this.props.refer(this.entity);
      }
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__
    };
    updateCircle(this.entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    if (this.entity) {
      this.entity.setMap(null);
      this.entity = null;
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  render() {
    return null;
  }
}

export default Circle;
