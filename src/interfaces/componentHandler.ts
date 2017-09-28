import observer from './observer';

export default interface componentHandler {
  componentChecksUpdate: observer;

  componentWillMount:        () => componentHandler;
  componentDidMount:         () => componentHandler;

  componentWillReceiveProps: () => componentHandler;
  shouldComponentUpdate:     () => componentHandler;
  componentWillUpdate:       () => componentHandler;
  render:                    () => componentHandler;
  componentDidUpdate:        () => componentHandler;

  componentWillUnmount:      () => componentHandler;
}
