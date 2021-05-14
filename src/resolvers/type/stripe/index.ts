
import GMR from 'graphql-merge-resolvers';
import resolversChargeType from './charge';

const typeChargeResolvers=GMR.merge([
    resolversChargeType
]);

export default typeChargeResolvers;