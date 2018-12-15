import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createCircle, updateCircle } from './api';

export class Circle extends Component {
  static propTypes = {
    __map__: PropTypes.object,
    options: PropTypes.object,
};

  constructor() {
    super();
    this.refElement = null;
    this.entity = null;
  }

  componentDidMount() {
    let { __map__, options, events} = this.props;
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
