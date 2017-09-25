export default interface component<props, localStateType, localActionType> {
  (props?: props): {
    local?: (localState: localStateType | null, localAction?: localActionType) => localStateType;
    actions?: {
      [actionName: string]: (event: Event) => localActionType;
    };
    render: (props: props) => JSX.Element;
  };
}
