import { globalAttributesElement } from './abstract/globalAttributesElement';


type metaElement =  globalAttributesElement<HTMLMetaElement> & {
  content?: string;
  httpEquiv?: "content-security-policy" | "refresh" | "set-cookie";
  name?: "application-name" | "author" | "description" | "keywords" | "referrer" | "creator" | "googlebot" | "publisher" | "robots" | "slurl" | "viewport";
};

export { metaElement };
