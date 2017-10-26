import redchain from 'redchain';
import Plusnew from 'index';
import scheduler from 'scheduler';
import LifeCycleHandler from 'instances/types/Component/LifeCycleHandler';

describe('rendering the elements', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;
  let local: redchain<string, string>;
  beforeEach(() => {
    local = new redchain((value: string, newValue: string) => newValue).dispatch('foo');
    
    plusnew = new Plusnew();
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('does a value change with redchain', () => {
    const component = (lifeCycleHandler: LifeCycleHandler) => {
      local.addOnChange(lifeCycleHandler.componentCheckUpdate);
      return () => <div className={local.state}>{local.state}</div>;
    };
    plusnew.render(component, container);

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe('DIV');
    expect(target.className).toBe('foo');
    expect(target.innerHTML).toBe('foo');

    local.dispatch('bar');
    scheduler.clean();

    expect(target.className).toBe('bar');
    expect(target.innerHTML).toBe('bar');
  });

  // it('does a value change with redchain with JSX.Element to string', () => {
  //   const component = (lifeCycleHandler: LifeCycleHandler) => {
  //     local.addOnChange(lifeCycleHandler.componentCheckUpdate);
  //     return () => local.state === 'foo' ? <div>{local.state}</div> : local.state;
  //   };
  //   plusnew.render(component, container);

  //   expect(container.childNodes.length).toBe(1);

  //   const target = container.childNodes[0] as HTMLElement;
  //   expect(target.nodeName).toBe('DIV');
  //   expect(target.innerHTML).toBe('foo');

  //   local.dispatch('bar');
  //   scheduler.clean();

  //   expect(container.innerHTML).toBe('bar');
  // });


  // it('does a value change with redchain with string to JSX.Element', () => {
  //   const component = (lifeCycleHandler: LifeCycleHandler) => {
  //     local.addOnChange(lifeCycleHandler.componentCheckUpdate);
  //     return () => local.state === 'foo' ? local.state : <div>{local.state}</div>;
  //   };
  //   plusnew.render(component, container);

  //   expect(container.innerHTML).toBe('foo');

  //   local.dispatch('bar');
  //   scheduler.clean();

  //   expect(container.childNodes.length).toBe(1);
  //   const target = container.childNodes[0] as HTMLElement;
  //   expect(target.nodeName).toBe('DIV');
  //   expect(target.innerHTML).toBe('bar');
  // });

  // it('does a value change with redchain with string to JSX.Element[]', () => {
  //   const component = (lifeCycleHandler: LifeCycleHandler) => {
  //     local.addOnChange(lifeCycleHandler.componentCheckUpdate);
  //     return () => local.state === 'foo' ? local.state : [<div>{local.state}</div>, <span>{local.state}</span>];
  //   };
  //   plusnew.render(component, container);

  //   expect(container.innerHTML).toBe('foo');

  //   local.dispatch('bar');
  //   scheduler.clean();

  //   expect(container.childNodes.length).toBe(2);
  //   const target = container.childNodes[0] as HTMLElement;
  //   expect(target.nodeName).toBe('DIV');
  //   expect(target.innerHTML).toBe('bar');

  //   const targetSecond = container.childNodes[1] as HTMLElement;
  //   expect(targetSecond.nodeName).toBe('SPAN');
  //   expect(targetSecond.innerHTML).toBe('bar');
  // });

  // it('does a value change with redchain with JSX.Element[] to string', () => {
  //   const component = (lifeCycleHandler: LifeCycleHandler) => {
  //     local.addOnChange(lifeCycleHandler.componentCheckUpdate);
  //     return () => local.state === 'foo' ? [<div>{local.state}</div>, <span>{local.state}</span>] : local.state;
  //   };
  //   plusnew.render(component, container);

  //   expect(container.childNodes.length).toBe(2);
  //   const target = container.childNodes[0] as HTMLElement;
  //   expect(target.nodeName).toBe('DIV');
  //   expect(target.innerHTML).toBe('foo');

  //   const targetSecond = container.childNodes[1] as HTMLElement;
  //   expect(targetSecond.nodeName).toBe('SPAN');
  //   expect(targetSecond.innerHTML).toBe('foo');

  //   local.dispatch('bar');
  //   scheduler.clean();

  //   expect(container.innerHTML).toBe('bar');
  // });
});
