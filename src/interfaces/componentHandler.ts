export default interface componentHandler {
  componentCheckUpdate:      () => componentHandler;

  componentWillMount:        () => componentHandler;
  componentDidMount:         () => componentHandler;

  componentWillReceiveProps: () => componentHandler;
  shouldComponentUpdate:     () => componentHandler;
  componentWillUpdate:       () => componentHandler;
  componentDidUpdate:        () => componentHandler;

  componentWillUnmount:      () => componentHandler;
}
