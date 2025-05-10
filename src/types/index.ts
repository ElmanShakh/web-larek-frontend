// категория скила

type categoryType = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хардскил';

// карточка с товаром

interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: categoryType;
  price: number | null;
}

// модель данных

interface IAppState {
  catalog: IItem[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
}

// выбор способа оплаты и адреса доставки

interface IOrderDetails {
  paymentMethod: string;
  adress: string;
}

// оформление email и телефон

interface IContactForm {
  email: string;
  phone: string;
}

// общая информация о заказе

interface IOrder extends IOrderDetails, IContactForm {
  items: string[]
}

// после оформления

interface IOrderMade {
  id: string;
  total: number;
}