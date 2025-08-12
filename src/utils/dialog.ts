import { DomClient } from "../services/domClient";

const dom = new DomClient();

type DialogType = 'confirm' | 'alert' | 'prompt';

export function createDialog(type: DialogType, message: string): Promise<boolean | void>{
    return new Promise((resolve) => {
        const modal = dom.getDivElement(document, 'confirm-dialog-modal');
    });

}