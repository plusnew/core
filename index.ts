import './src/interfaces/jsx';

import Plusnew from './src';
import scheduler from './src/scheduler';
import component, { componentResult } from './src/interfaces/component';
import store from 'redchain';

export { Plusnew, scheduler, component, componentResult, store };
export default new Plusnew();
