import { IAppState, IItem, IOrderForm, IContactForm, IOrder, IOrderMade, FormErrors} from "../types";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
  catalog: IItem[]
};

export class AppState extends Model<IAppState>{
  catalog: IItem[];
  basket: IItem[] = [];
  preview: string | null;
  order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    items: []
  };
  formErrors: FormErrors = {};


  addBasketItem(item: IItem) {
    if (!this.basket.includes(item)) {
      this.basket.push(item);
      this.order.items.push(item.id);
      this.emitChanges('basket:changed');
    }
   
  }

  deleteBasketItem(item: IItem) {
    this.basket = this.basket.filter(basketItem => basketItem.id !== item.id);
    this.emitChanges('basket:changed');
}

  clearBasket() {
    this.basket = [];
    this.order.items = [];
    this.emitChanges('basket:changed');
  }

  sumTotalBasketPrice() {
    return this.basket.reduce((sum, item) => sum + (item.price || 0), 0)
  }

  openItem(item: IItem){ 
    this.preview = item.id;
    this.emitChanges('preview:changed', item)
  }

  validateOrderForm(){
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адресс';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContactForm() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  setContactsField(field: keyof IContactForm, value: string): void {
    this.order[field] = value;
    this.validateContactForm(); 
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;
    this.validateOrderForm(); 
 }

  setCatalog(items: IItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed', {catalog: this.catalog});
	}
}