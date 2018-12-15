import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createMarker, updateMarker } from './api';

export class Marker extends Component {
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

  componentWillMount() {

  }

  componentDidMount() {
    let { __map__, options, events} = this.props;
    let opts = { ...(options || {}), map: __map__ };
    this.entity = createMarker(opts, events);
    if (this.entity) {
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUpdate() {
  }

  componentDidUpdate(prevProps) {
    let { __map__, options, events} = this.props;
    let opts = { ...(options || {}), map: __map__ };
    if (!this.entity) {
      this.entity = createMarker(opts, events);
      if (this.entity) {
        if (this.props.refer) this.props.refer(this.entity);
      }
      return;
    }

    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__,
      content: prevProps.children
    };
    updateMarker(this.entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    if (this.entity) {
      //   this.entity.clearMap();
      this.entity.stopMove();
      this.entity.setMap(null);
      this.entity = null;
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  render() {

    return null;
  }
}

export default Marker;
