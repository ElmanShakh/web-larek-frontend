import { Api, ApiListResponse } from './base/api';
import { IItem, IOrder, IOrderMade } from '../types';

export interface IAppapi {
  getItemList(): Promise<IItem[]>;
  orderItems(order: IOrder): Promise<IOrderMade>;
}

export class Appapi extends Api implements IAppapi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

  getItemList(): Promise<IItem[]> {
    return this.get('/product').then((data: ApiListResponse<IItem>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
  }
  orderItems(order: IOrder): Promise<IOrderMade> {
    return this.post('/order', order).then(
        (data: IOrderMade) => data
    );
  }


}