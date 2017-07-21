class TemplateInterface {
  constructor(prefix: any, state: any, props: any) {
    
  }

  public roots: {element: HTMLElement}[];

  public getHtml(): string {
    return '';
  }
}

export default TemplateInterface;
