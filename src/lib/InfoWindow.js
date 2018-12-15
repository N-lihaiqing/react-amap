import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createInfoWindow, updateInfoWindow } from './api';

export class InfoWindow extends Component {
  static propTypes = {
    __map__: PropTypes.object,
    options: PropTypes.object,
    events: PropTypes.object
  };

  constructor() {
    super();
    this.refElement = null;
    this.entity = null;
  }

  componentDidMount() {
    let { __map__, options, events, children } = this.props;
    let opts = { ...(options || {}), map: __map__ };
    this.entity = createInfoWindow(opts, events);
    if (this.entity) {
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  componentDidUpdate(prevProps) {
    let { __map__, options, events, children } = this.props;
    let opts = { ...(options || {}), map: __map__ };
    if (!this.entity) {
      this.entity = createInfoWindow(opts, events);
      if (this.entity) {
        if (this.props.refer) this.props.refer(this.entity);
      }
      return;
    }

    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__
    };
    updateInfoWindow(this.entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    if (this.entity) {
      //   this.entity.clearMap();
      this.entity.setMap(null);
      // delete this.entity;
      this.entity = null;
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  render() {
    return null;
  }
}

export default InfoWindow;
