import { IResolvers } from 'graphql-tools';
import GenreService from '../../services/genre.service';
import ShopProductsService from '../../services/shop-product.service';

const resolversShopProductMutation:IResolvers={
    Mutation: {
        updateStock(_,{update},{db}){
            console.log(update);
            return new ShopProductsService(_,{},{db}).updateStock(update);
        }
    }
};

export default resolversShopProductMutation;