import { Injectable } from '@angular/core';

const ID = 'helgoland-notifier';
const TIME_IN_MS = 3000;

@Injectable()
export class NotifierService {

    private notifierTimeout: any;

    constructor() {
        const notifierElement = document.getElementById(ID);
        if (!notifierElement) {
            const node = document.createElement('div');
            node.id = ID;
            node.className = 'hide';
            const textNode = document.createTextNode('');
            node.appendChild(textNode);
            document.body.appendChild(node);
        }
    }

    public notify(text: string) {
        clearTimeout(this.notifierTimeout);
        const notifierElement = document.getElementById(ID);
        notifierElement.innerHTML = text;
        notifierElement.className = notifierElement.className.replace('hide', 'show');
        this.notifierTimeout = setTimeout(() => {
            notifierElement.className = notifierElement.className.replace('show', 'hide');
        }, TIME_IN_MS);
    }
}
