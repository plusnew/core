class TemplateInterface {
  public roots: {element: HTMLElement}[];

  constructor(prefix: any, state: any, props: any) {
    
  }

  public getHtml(): string {
    return '';
  }
}

export default TemplateInterface;
