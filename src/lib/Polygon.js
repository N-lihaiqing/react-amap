import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createPolygon, updatePolygon } from './api';
const __com__ = 'Polygon';
//const debug = console.log;
const debug = () => {};

export class Polygon extends Component {
  static propTypes = {
    __map__: PropTypes.object,
    options: PropTypes.object,
    events: PropTypes.object
  };

  constructor() {
    super();
    this.refElement = null;
    this.entity = null;
    debug(__com__, 'constructor', this.entity);
  }

  componentDidMount() {
    debug(__com__, 'componentDidMount', this.entity);
    let { __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this.entity = createPolygon(opts, events);
    if (this.entity) {
      if (this.props.refer) this.props.refer(this.entity);
    }
}

  componentDidUpdate(prevProps) {
    debug(__com__, 'componentDidUpdate', this.entity);
    let { __map__, options, events, children } = this.props;
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    if (!this.entity) {
      this.entity = createPolygon(opts, events);
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
    updatePolygon(this.entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    debug(__com__, 'componentWillUnmount', this.entity);
    if (this.entity) {
      this.entity.setMap(null);
      // delete this.entity;
      this.entity = null;
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   debug(__com__, 'shouldComponentUpdate', this.entity);
  //   return false;
  // }
  render() {
    debug(__com__, 'render', this.entity);
    return null;
  }
}

export default Polygon;
