import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMap, updateMap } from './api';

const __com__ = 'Map';
const debug = () => {};

export class Map extends Component {
  static propTypes = {
    refer: PropTypes.func, // 类似ref的函数形式,可以让父组件调用entity
    options: PropTypes.object,
    events: PropTypes.object,
      zoom: PropTypes.number, // 10, //设置地图显示的缩放级别
      center: PropTypes.array, // [116.397428, 39.90923]，//设置地图中心点坐标
      layers: PropTypes.array, // [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
      mapStyle: PropTypes.string, // 'amap://styles/whitesmoke',  //设置地图的显示样式
      viewMode: PropTypes.string, // '2D',  //设置地图模式
      lang: PropTypes.string, // 'zh_cn',  //设置地图语言类型
      // events: PropTypes.object // {'click': function}, // 事件map
  };
  constructor() {
    super();
    this.refElement = null;
    this.entity = null;
  }

  componentWillMount() {
  }

  componentDidMount() {
    let { options, events } = this.props;
    this.entity = createMap(this.refElement, options, events);
    if (this.entity) {
      if (this.props.refer) this.props.refer(this.entity);
      this.setState({ __map__: this.entity });
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUpdate() {
  }

  componentDidUpdate(prevProps) {
    let { options, events } = this.props;
    if (!this.entity) {
      this.entity = createMap(this.refElement, options, events);
      if (this.entity) {
        if (this.props.refer) this.props.refer(this.entity);
        this.setState({ __map__: this.entity });
      }
      return;
    }
    // need check props changes, then update.
    //updateMap(this.entity, this.props, prevProps);
    updateMap(
      this.entity,
      options,
      events,
      prevProps.options,
      prevProps.events
    );
  }

  componentWillUnmount() {
    if (this.entity) {
      //   this.entity.clearMap();
      this.entity.destroy();
      //   delete this.entity;
      this.entity = null;
      if (this.props.refer) this.props.refer(this.entity, 'layerCount:'+(this.entity && this.entity.getLayers().length));
    }
  }

  renderChildren(children, __map__) {
    return React.Children.map(children, child => {
      if (child) {
        const cType = child.type;
        /* 针对下面两种组件不注入地图相关属性
         * 1. 明确声明不需要注入的
         * 2. DOM 元素
         */
        if (cType.preventAmap || typeof cType === 'string') {
          return child;
        }
        return React.cloneElement(child, {
          __map__
        });
      }
      return child;
    });
  }
  render() {
    let { className, style, children } = this.props;
    let restProps = {};
    if (className) restProps = { ...restProps, className };
    if (style) restProps = { ...restProps, style };

    return (
      <div
        ref={ele => {
          this.refElement = ele;
        }}
        {...restProps}
      >
        {this.renderChildren(children, this.entity)}
      </div>
    );
  }
}

export default Map;
