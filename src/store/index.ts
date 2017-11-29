type initialAction = {
  type: 'store::init';
};

export default class Store<stateType, actionType>{
  public state: stateType;
  private initialAction: initialAction = { type: 'store::init' };
  private reducer: ((state: stateType | null, action: actionType | initialAction) => stateType);
  private onChanges: ((lastAction: actionType) => void)[];
  constructor(reducer: ((state: stateType | null, action: actionType | initialAction) => stateType)) {
    this.reducer = reducer;
    this.onChanges = [];
    this.state = this.reducer(null, this.initialAction);
  }

  public dispatch(action: actionType) {
    const currentState = this.reducer(this.state, action);

    if (this.state !== currentState) {
      this.state = currentState;
      this.onChanges.forEach((onChange) => {
        onChange(action);
      });
    }

    return this;
  }

  public addOnChange(onChange: (lastAction: actionType) => void) {
    this.onChanges.push(onChange);

    return this;
  }
}
