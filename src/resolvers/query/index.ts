import GMR from 'graphql-merge-resolvers';
import resolversDashboardQuery from './dashboard';
import resolversGenreQuery from './genre';
import resolversPlataformQuery from './platform';
import resolversProductsQuery from './shop-product';
import queryStripeResolvers from './stripe';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const queryResolvers=GMR.merge([
    resolversUserQuery,
    resolversProductsQuery,
    resolversGenreQuery,
    resolversTagQuery,
    resolversPlataformQuery,
    queryStripeResolvers,
    resolversDashboardQuery
]);

export default queryResolvers;