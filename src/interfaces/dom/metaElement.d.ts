import { htmlGlobalAttributesElement } from './abstract/htmlGlobalAttributesElement';


type metaElement =  htmlGlobalAttributesElement<HTMLMetaElement> & {
  content?: string;
  httpEquiv?: "content-security-policy" | "refresh" | "set-cookie";
  name?: "application-name" | "author" | "description" | "keywords" | "referrer" | "creator" | "googlebot" | "publisher" | "robots" | "slurl" | "viewport";
};

export { metaElement };
