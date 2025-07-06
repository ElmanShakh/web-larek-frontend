// категория скила

type categoryType = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хардскил';

// карточка с товаром

export interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: categoryType;
  price: number | null;
}

// модель данных

export interface IAppState {
  catalog: IItem[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
}

// выбор способа оплаты и адреса доставки

export interface IOrderForm {
  payment: string;
  address: string;
}

// оформление email и телефон

export interface IContactForm {
  email: string;
  phone: string;
}

// общая информация о заказе

export interface IOrder extends IOrderForm, IContactForm {
  items: string[]
}

// после оформления

export interface IOrderMade {
  id: string;
  total: number;
}

// информация о корзине

export interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

// тип с ошибками в заполнямых формах
export type FormErrors = Partial<Record<keyof IOrder, string>>