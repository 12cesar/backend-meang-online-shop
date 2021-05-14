
import GMR from 'graphql-merge-resolvers';
import resolversPlatformType from './platform';
import resolversProductType from './product';
import resolversShopProductType from './shop-product';
import typeChargeResolvers from './stripe';

const typeResolvers=GMR.merge([
    resolversShopProductType,
    resolversPlatformType,
    resolversProductType,
    typeChargeResolvers
]);

export default typeResolvers;