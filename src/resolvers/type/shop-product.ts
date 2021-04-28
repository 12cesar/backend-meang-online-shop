import { IResolvers } from 'graphql-tools';
import PlatformService from '../../services/plataform.service';
import ProductService from '../../services/product.service';

const resolversShopProductType: IResolvers = {
    ShopProduct: {
        productId: (parent) => parent.product_id,
        platformId: (parent) => parent.platform_id,
        product: async (parent,_,{db})=>{
            const result = await new ProductService({},{id:parent.product_id}, {db}).details();
            return result.product;
        },
        platform: async (parent,_,{db})=>{
            const result = await new PlatformService({},{id:parent.platform_id}, {db}).details();
            return result.platform;
        }

    }
};

export default resolversShopProductType;