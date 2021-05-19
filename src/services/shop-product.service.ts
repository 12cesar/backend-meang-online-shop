
import { findOneElement, manageStockUpdate } from './../lib/db-operations';
import { ACTIVE_VALUES_FILTER, COLLECTIONS, SUBSCRIPTIONS_EVENT } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { IStock } from '../interfaces/stock.interface';
import { randomItems } from '../lib/db-operations';
import ResolversOperationsService from './resolvers-operations.service';
import { PubSub } from 'apollo-server-express';

class ShopProductsService extends ResolversOperationsService {
  collection = COLLECTIONS.SHOP_PRODUCT;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  async items(
    active: string = ACTIVE_VALUES_FILTER.ACTIVE,
    platform: Array<string> = ['-1'],
    random: boolean = false,
    otherFilters: object = {}
  ) {
    let filter: object = { active: { $ne: false } };
    if (active === ACTIVE_VALUES_FILTER.ALL) {
      filter = {};
    } else if (active === ACTIVE_VALUES_FILTER.INACTIVE) {
      filter = { active: { $eq: false } };
    }
    if (platform[0] !== '-1' && platform !== undefined) {
      filter = { ...filter, ...{ platform_id: {$in: platform} } };
    }
    if (otherFilters !== {} && otherFilters !== undefined) {
      filter = { ...filter, ...otherFilters };
    }
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    if (!random) {
      const result = await this.list(
        this.collection,
        'Productos de la tienda',
        page,
        itemsPage,
        filter
      );
      return {
        info: result.info,
        status: result.status,
        message: result.message,
        shopProducts: result.item,
      };
    }
    const result: Array<object> = await randomItems(
      this.getDb(),
      this.collection,
      filter,
      itemsPage
    );
    if (result.length === 0 || result.length !== itemsPage) {
      return {
        info: {
          page: 1,
          pages: 1,
          itemsPage,
          total: 0,
        },
        status: false,
        message:
          'La informacion que hemos pedido no se ha obtenido tal como deseabamos',
        shopProducts: [],
      };
    }
    return {
      info: {
        page: 1,
        pages: 1,
        itemsPage,
        total: itemsPage,
      },
      status: false,
      message: 'La informacion que hemos pedido se ha cargado correctamente',
      shopProducts: result,
    };
  }
  async details(){
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      shopProduct: result.item,
    };
  }
  async updateStock(updateList: Array<IStock>, pubsub: PubSub){
    try {
      updateList.map(async (item: IStock) => {
        const itemDetails = await findOneElement(
          this.getDb(),
          COLLECTIONS.SHOP_PRODUCT,
          {id: +item.id}
        );
        if (item.increment < 0 && (item.increment + itemDetails < 0)) {
          item.increment = -itemDetails.stock;         
        }
        await manageStockUpdate(
          this.getDb(),
          COLLECTIONS.SHOP_PRODUCT,
          {id: +item.id},
          {stock: item.increment}
        );
        itemDetails.stock += item.increment;
        pubsub.publish(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT, { selectProductStockUpdate: itemDetails});         
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
export default ShopProductsService;
