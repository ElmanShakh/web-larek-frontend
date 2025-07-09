	import { Form } from './common/form';
	import { IOrderForm } from '../types';
	import { IEvents } from './base/events';
	import { ensureElement } from '../utils/utils';

	export class Orderform extends Form<IOrderForm> {
		protected _btnPaymentOnline: HTMLButtonElement;
		protected _btnPaymentCash: HTMLButtonElement;
		protected _addressInput: HTMLInputElement;

		constructor(container: HTMLFormElement, events: IEvents) {
			super(container, events);

			this._btnPaymentOnline = ensureElement<HTMLButtonElement>(
				'button[name=card]',
				container
			);

			this._btnPaymentCash = ensureElement<HTMLButtonElement>(
				'button[name=cash]',
				container
			);
			
			this._addressInput = ensureElement<HTMLInputElement>('input', container);

			this._btnPaymentOnline.addEventListener('click', () => {
				this.setPaymentMethod('online');
			});

			this._btnPaymentCash.addEventListener('click', () => {
				this.setPaymentMethod('cash');
			});

			this._addressInput.addEventListener('input', () => {
				this.events.emit('orderForm:change', {
					address: this._addressInput.value,
				});
			});
		}
		protected setPaymentMethod(method: 'online' | 'cash') {
			this.toggleClass(this._btnPaymentOnline, 'button_alt-active', method === 'online');
			this.toggleClass(this._btnPaymentCash, 'button_alt-active', method === 'cash');
			this.events.emit('order.payment:change', {
				field: 'payment',
				value: method
			});
		}

		set address(value: string) {
			this._addressInput.value = value;
		}

		set payment(value: 'online' | 'cash') {
			this.setPaymentMethod(value);
		}
	}
