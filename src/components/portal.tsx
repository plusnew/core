import type { Props } from "../";
import plusnew, { component } from "../index";
import type ComponentInstance from "../instances/types/Component/Instance";

export type portalRenderOption<HostElement, HostTextElement> = {
  [key: string]: ComponentInstance<
    portalExitProps,
    HostElement,
    HostTextElement
  >;
};

type portalExitProps = { name: string };

export const PortalExit = component(
  "PortalExit",
  (Props: Props<portalExitProps>, componentInstance) => {
    const portalName = Props.getState().name; // @TODO add check if name changes, if so throw exception;

    if (
      portalName in
      (componentInstance.renderOptions.portals as portalRenderOption<any, any>)
    ) {
      throw new Error(
        `Could not create a PortalExit with the same name ${portalName}`
      );
    }

    (componentInstance.renderOptions.portals as portalRenderOption<any, any>)[
      portalName
    ] = componentInstance;

    componentInstance.registerLifecycleHook("componentWillUnmount", () => {
      delete (componentInstance.renderOptions.portals as portalRenderOption<
        any,
        any
      >)[portalName];
    });
    return null;
  }
);

export const PortalEntrance = component(
  "PortalEntrance",
  (Props: Props<{ name: string; children: any }>, componentInstance) => {
    const portalName = Props.getState().name; // @TODO add check if name changes, if so throw exception;
    if (
      componentInstance.renderOptions.portals !== undefined &&
      portalName in componentInstance.renderOptions.portals === true
    ) {
      componentInstance.appendChild = (childInstance) => {
        (componentInstance.renderOptions.portals as portalRenderOption<
          any,
          any
        >)[portalName].appendChild(
          childInstance,
          null // @TODO this should be fixed, that looks wrong
        );
      };

      componentInstance.getLastIntrinsicInstance =
        componentInstance.getPredecessor; // When portalentrance gets asked, what its own hostelement it is, the predecessor of its environment should answer for it

      componentInstance.renderOptions.driver.setupPortal({
        portalEntrance: componentInstance,
        portalExit: (componentInstance.renderOptions
          .portals as portalRenderOption<any, any>)[portalName],
      });
    } else {
      throw new Error(`Could not find PortalExit with name ${portalName}`);
    }

    return <Props>{(props) => props.children}</Props>;
  }
);
