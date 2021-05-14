import GMR from 'graphql-merge-resolvers';
import resolversStripeCardMutation from './card';
import resolversStripeChargeMutation from './charge';
import resolversStripeCustomerMutation from './customer';

const mutationStripeResolvers=GMR.merge([
    resolversStripeCustomerMutation,
    resolversStripeCardMutation,
    resolversStripeChargeMutation
]);

export default mutationStripeResolvers;