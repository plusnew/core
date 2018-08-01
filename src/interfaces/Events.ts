// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
const nothing = null;
export { nothing };

interface PlusnewKeyboardEvent<target extends HTMLElement> extends KeyboardEvent {
  target: target;
}

interface PlusnewMouseEvent<target extends HTMLElement> extends KeyboardEvent {
  target: target;
}

interface PlusnewTouchEvent<target extends HTMLElement> extends TouchEvent {
  target: target;
}

export {
  PlusnewKeyboardEvent as KeyboardEvent,
  PlusnewMouseEvent as MouseEvent,
  PlusnewTouchEvent as TouchEvent,
};

