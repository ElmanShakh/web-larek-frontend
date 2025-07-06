import './scss/styles.scss';

import { Appapi } from './components/appapi';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent} from './components/appstate';
import {Page} from './components/page';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from './components/common/modal';
import {Success} from './components/common/succes';
import { Item } from './components/item';
import { Orderform } from './components/orderform';
import { Basket } from './components/common/basket';
import { contactForm } from './components/contsactform';
import { IItem, IContactForm, IOrderForm, IOrder, IOrderMade } from './types';

const events = new EventEmitter();
const api = new Appapi(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Все шаблоны 
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts')

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Orderform(cloneTemplate(orderTemplate), events);
const contacts = new contactForm(cloneTemplate(contactTemplate), events);

// Изменения в катологе  

events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new Item(cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:select', item)   
      });
      return card.render({
          title: item.title,
          image: item.image,
          description: item.description,
          price: item.price
      });
  });
});


// Отправлена форма заказа

events.on('contacts:submit', () => {
    const orderData = {
      payment: appData.order.payment,
      address: appData.order.address,
      email: appData.order.email,
      phone: appData.order.phone,
      items: appData.basket.map(item => item.id),
      total: appData.sumTotalBasketPrice()
    };
  
    const success = new Success(cloneTemplate(successTemplate), {
      onClick: () => modal.close()
    });
  
    api.orderItems(orderData)
      .then((result: IOrderMade) => {
        success.total = result.total.toString();
        modal.render({ content: success.render({}) });
        appData.clearBasket();
      })
    
  });

// Изменилось состояние валидации формы

//форма ввода контактных данных

events.on('formErrors:change', (errors: Partial<IContactForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

//форма ввода адреса и выбора метода оплаты

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей

events.on(/^contacts\..*:change/, (data: { field: keyof IContactForm, value: string }) => {
    appData.setContactsField(data.field, data.value);
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
        appData.setOrderField(data.field, data.value);
    }
);

// Открыть форму заказа + форма ввода контактных данных
events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: appData.order.email,
            phone: appData.order.phone,
            valid: false,
            errors: []
        })
    });
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: basket.render({
        })
    })
})

// Открыть лот
events.on('card:select', (item: IItem) => {
    appData.openItem(item);
});

// Изменения в корзине

events.on('preview:changed', (item: IItem) => {
    const card = new Item(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        const isInCart = appData.basket.some(cartItem => cartItem.id === item.id);
  
        if (isInCart) {
          events.emit('item:delete', { id: item.id });
          card.btnTitle = 'В корзину';
        } else {
          events.emit('item:add', item);
          card.btnTitle = 'Удалить из корзины';
        }
      }
    });
  
    card.btnTitle = appData.basket.includes(item) ? 'Удалить из корзины' : 'В корзину';
  
    modal.render({
        content: card.render({
          category: item.category,
          title: item.title,
          image: item.image,
          description: item.description,
          price: item.price,
        }),
      });
  });

// basket change
events.on('basket:changed', () => {
    page.counter = appData.basket.length;
  
    basket.items = appData.basket.map((itemId) => {
      const itemData = appData.catalog.find(item => item.id === itemId.id);
      if (!itemData) return null;
  
      const productCard = new Item(cloneTemplate(cardBasketTemplate), {
        onClick: () => {
          events.emit('item:delete', itemId);
        },
      });
  
      return productCard.render({
        title: itemData.title,
        price: itemData.price ?? 0,
      });
    }).filter(Boolean) as HTMLElement[];
  
    basket.total = appData.sumTotalBasketPrice();

    basket.selected = appData.basket.map(item => item.id);
  });

// Добавить товар в корзину и удалить его

events.on('item:add', (item: IItem) => {
    appData.addBasketItem(item)
})

events.on('item:delete', (item: IItem) => {
    appData.deleteBasketItem(item);
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getItemList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

