import './src/interfaces/jsx';

import Plusnew from './src';
import scheduler from './src/scheduler';
import component, { componentResult } from './src/interfaces/component';
import InputEvent from './src/interfaces/InputEvent';
import store from 'redchain';

export { Plusnew, scheduler, component, componentResult, store, InputEvent };
export default new Plusnew();
