export default {
  getReference(state: any, key:Array<string>): any {
    for(let i = 0; i < key.length; i++) {
      if(i + 1 !== key.length) {
        if(key[i] in state) {
          state = state[key[i]];
        } else {
          throw new Error('State-Error'); // @TODO change to more expressive name
        }
      }
    }

    return state;
  }
}