import { SensorMLNamespaceResolver } from './SensorMLNamespaceResolver';

export class XPathDocument {
  public static parse(xml: string): XPathDocument {
    const parser = new DOMParser();
    const document = parser.parseFromString(xml, 'application/xml');
    return new XPathDocument(document);
  }

  constructor(public document: Document) {}

  public eval(
    expr: string,
    context?: Node,
  ): boolean | string | number | Node | Node[] {
    const result = this._eval(expr, context);

    switch (result.resultType) {
      case XPathResult.FIRST_ORDERED_NODE_TYPE:
        return result.singleNodeValue !== null && result.singleNodeValue;
      case XPathResult.ANY_UNORDERED_NODE_TYPE:
        return result.singleNodeValue !== null && result.singleNodeValue;
      case XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
      case XPathResult.NUMBER_TYPE:
        return result.numberValue;
      case XPathResult.STRING_TYPE:
        return result.stringValue;
      case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
        return this.parseIterator(result);
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        return this.parseIterator(result);
      case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
        return this.parseSnapshot(result);
      case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
        return this.parseSnapshot(result);
    }
    throw new Error('Unsupported result type: ' + result.resultType);
  }

  private parseSnapshot(result: XPathResult): Node[] {
    const array: Node[] = [];
    for (let i = 0; i < result.snapshotLength; ++i) {
      const temp = result.snapshotItem(i);
      if (temp) {
        array.push(temp);
      }
    }
    return array;
  }

  private parseIterator(result: XPathResult): Node[] {
    const array: Node[] = [];
    let node = result.iterateNext();
    while (node != null) {
      array.push(node);
      node = result.iterateNext();
    }
    return array;
  }

  private _eval(expression: string, context?: Node) {
    context = context || this.document.documentElement;
    const resolver: XPathNSResolver = {
      lookupNamespaceURI(prefix: string): string {
        return new SensorMLNamespaceResolver().getNamespace(prefix);
      },
    };
    return this.document.evaluate(
      expression,
      context,
      resolver,
      XPathResult.ANY_TYPE,
      null,
    );
  }
}
