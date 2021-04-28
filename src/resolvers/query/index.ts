import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversPlataformQuery from './platform';
import resolversProductsQuery from './shop-product';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const queryResolvers=GMR.merge([
    resolversUserQuery,
    resolversProductsQuery,
    resolversGenreQuery,
    resolversTagQuery,
    resolversPlataformQuery
]);

export default queryResolvers;