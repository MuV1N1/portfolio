export class DomClient {
    querrySelector(document: Document, className: string): HTMLElement | null {
        return document.querySelector(`.${className}`);
    }
    getElementById(document: Document, id: string): HTMLElement | null {
        return document.getElementById(id);
    }
    getBody(document: Document): HTMLBodyElement {
        return document.querySelector('body') as HTMLBodyElement;
    }
    getLabelElement(document: Document, value: string, type: 'id' | 'class'): HTMLLabelElement {
        return type === 'id'
            ? this.getElementById(document, value) as HTMLLabelElement
            : this.querrySelector(document, value) as HTMLLabelElement;
    }
    getFormElement(document: Document, id: string): HTMLFormElement {
        return document.getElementById(id) as HTMLFormElement;
    }
    getDivElement(document: Document, id: string): HTMLDivElement {
        return document.getElementById(id) as HTMLDivElement;
    }
    getSpanElement(document: Document, value: string): HTMLSpanElement {
        return document.querySelector(value) as HTMLSpanElement;
    }
    getInputElement(document: Document, id: string): HTMLInputElement {
        return document.getElementById(id) as HTMLInputElement;
    }
    getTextAreaElement(document: Document, id: string): HTMLTextAreaElement {
        return document.getElementById(id) as HTMLTextAreaElement;
    }
    getButtonElement(document: Document, id: string): HTMLButtonElement {
        return document.getElementById(id) as HTMLButtonElement;
    }
    getElementByClassOfElement(element: HTMLElement, value: string): HTMLFormElement | null {
        return element.querySelector(value) as HTMLFormElement | null;
    }
}