import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type bodyElement =  htmlGlobalAttributesElement<HTMLBodyElement> & {
  onafterprint?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onbeforeprint?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onbeforeunload?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onblur?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onerror?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onfocus?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onhashchange?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onlanguagechange?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onload?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onmessage?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onoffline?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  ononline?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onpopstate?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onredo?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onresize?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onstorage?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onundo?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
  onunload?: "(event: Event & { currentTarget: HTMLBodyElement }) => void";
};

export { bodyElement };
