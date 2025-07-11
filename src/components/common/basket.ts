import {Component} from "../base/Component";
import {EventEmitter} from "../base/events";
import { IBasketView } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";


export class Basket extends Component<IBasketView> {
  
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _btn: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._btn = this.container.querySelector('.basket__button');

    if (this._btn) {
      this._btn.addEventListener('click', () => {
          events.emit('order:open');
      });
  }

  this.items = [];

    
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
        this._list.replaceChildren(...items);
        this.setDisabled(this._btn, false);
    } else {
        this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста'
        }));
        this.setDisabled(this._btn, true);
    }
}

  set selected(items: string[]) {
    if (items.length) {
        this.setDisabled(this._btn, false);
    } else {
        this.setDisabled(this._btn, true);
    }
  }

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }
}
