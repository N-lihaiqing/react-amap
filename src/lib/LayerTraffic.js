import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createTraffic, updateTraffic } from './api';

export class Traffic extends Component {
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
    //let opts = { ...(options || {}), map: __map__, content: children };
    let opts = { ...(options || {}), map: __map__ };
    this.entity = createTraffic(opts, events);
    if (this.entity) {
      if (this.props.refer) this.props.refer(this.entity);
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUpdate() {
  }

  componentDidUpdate(prevProps) {
    let { __map__, options, events } = this.props;
    let opts = { ...(options || {}), map: __map__ };
    if (!this.entity) {
      this.entity = createTraffic(opts, events);
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
    updateTraffic(this.entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    if (this.entity) {
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

export default Traffic;
