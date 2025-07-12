import { Component } from "./base/Component";
import { IItem } from "../types";
import { ensureElement } from "../utils/utils";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Item extends Component<IItem> {
  protected _id: HTMLElement;
  protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _btn: HTMLButtonElement;

  
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._id = container.querySelector('.basket__item-index');
    this._description = container.querySelector('.card__text');
    this._image = container.querySelector('.card__image');
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._category = container.querySelector('.card__category');
    this._price = container.querySelector('.card__price');
    this._btn = container.querySelector('.card__button');

    if (actions?.onClick) {
      if (this._btn) {
        this._btn.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick)
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
        this._description.replaceWith(...value.map(str => {
            const descTemplate = this._description.cloneNode() as HTMLElement;
            this.setText(descTemplate, str);
            return descTemplate;
        }));
    } else {
        this.setText(this._description, value);
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set category(value: string) {
    this.setText(this._category, value)
  }

  get category(): string {
    return this._category.textContent || '';
  }

  set price(value: number) {
    this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
  }

  get price(): string {
    return this._price.textContent || ''; 
  }
  
  set btnTitle(value: string) {
    if (this._btn) {
      this.setText(this._btn, value)
    }
  }

  
  set index(value: number) {
    if (this._id) {
      this.setText(this._id, value.toString());
    }
  }

  
  set isDisabled(value: boolean) {
    this.container.classList.toggle('disabled', value);
  }

  set btnDisabled(value: boolean) {
    if (this._btn) {
      this._btn.disabled = value;
    }
  }
}