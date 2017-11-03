import './src/interfaces/jsx';

import Plusnew from './src';
import LifeCycleHandler from './src/instances/types/Component/LifeCycleHandler';
import scheduler from './src/scheduler';
import component from './src/interfaces/component';
import { default as store } from 'redchain';

export { Plusnew, LifeCycleHandler, scheduler, component, store };
export default new Plusnew();
